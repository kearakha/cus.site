import OpenAI from "openai";
import { z } from "zod";
import type { WizardInput } from "./schemas/wizard";

/**
 * Cus Engine — AI Handler
 *
 * OpenAI-compatible API. Default ke OpenAI langsung, tapi bisa di-override
 * ke aggregator lain (TokenRouter, OpenRouter, Portkey, dll) via env.
 *
 * Dua mode:
 * 1. **Structured Outputs** (preferred) — pakai `response_format: zodSchema`
 *    Output dijamin match Zod schema. Butuh model yang support.
 * 2. **JSON Prompt + Manual Parse** (fallback) — prompt minta JSON,
 *    parse manual dari response.content, validate via Zod.
 *
 * Mode 1 dicoba dulu. Kalau model gak support (400/unsupported), otomatis
 * fallback ke mode 2.
 *
 * Constraint penting:
 * - services.length WAJIB sama dengan input.layanan.length (1:1 mapping)
 * - Tidak boleh ada placeholder ("Lorem Ipsum", "[Alamat]", dll)
 * - Bahasa Indonesia natural sesuai vibe
 */

// === Client initialization ===

// Lazy singleton: OpenAI client dibuat saat pertama kali dipakai, supaya
// env vars udah ter-load. Instantiation di module-level bisa gagal kalau
// file ini di-import sebelum dotenv load (misal di scripts/test).
let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (_client) return _client;
  _client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // Base URL override — kalau gak di-set, default ke OpenAI public API.
    // Set OPENAI_BASE_URL=https://api.tokenrouter.com/v1 untuk pakai TokenRouter.
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
  return _client;
}

const MODEL = process.env.OPENAI_MODEL || "MiniMax-M3";

// === Zod schema untuk output AI ===

const serviceOutputSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(60)
    .describe("Judul layanan yang menarik, max 60 karakter"),
  description: z
    .string()
    .min(20)
    .max(400)
    .describe(
      "Deskripsi persuasif 1-3 kalimat (max 400 char), tanpa placeholder",
    ),
});

export const testimoniItemSchema = z.object({
  nama: z
    .string()
    .min(2)
    .max(40)
    .describe("Nama pelanggan fiktif yang realistis (nama Indonesia)"),
  teks: z
    .string()
    .min(20)
    .max(200)
    .describe("Review positif singkat, natural, sesuai vibe bisnis"),
});

export const kontenAISchema = z.object({
  heroHeadline: z
    .string()
    .min(10)
    .max(80)
    .describe("Headline utama yang menarik, mencerminkan value proposition"),
  heroSubtext: z
    .string()
    .min(15)
    .max(150)
    .describe("Sub-headline yang menjelaskan benefit utama"),
  aboutParagraph: z
    .string()
    .min(80)
    .max(500)
    .describe(
      "Paragraf tentang bisnis, tone sesuai vibe, sebut lokasi spesifik",
    ),
  ctaText: z
    .string()
    .min(2)
    .max(25)
    .describe("Teks tombol CTA yang action-oriented"),
  seoTitle: z
    .string()
    .min(20)
    .max(60)
    .describe("Judul SEO (muncul di tab browser & Google)"),
  seoDescription: z
    .string()
    .min(60)
    .max(160)
    .describe("Meta description untuk hasil pencarian Google"),
  accentColor: z
    .string()
    .regex(/^[0-9a-fA-F]{6}$/, "Hex color tanpa #")
    .describe(
      "Warna aksen hex (tanpa #). Casual=warm, Professional=blue, Elegant=gold/earth",
    ),
  services: z
    .array(serviceOutputSchema)
    .describe("Array layanan dengan panjang PERSIS sama dengan input user"),
  testimoni: z
    .array(testimoniItemSchema)
    .length(3)
    .describe(
      "Tepat 3 testimoni pelanggan fiktif yang realistis, sesuai vibe bisnis",
    ),
});

export type KontenAI = z.infer<typeof kontenAISchema>;
export type TestimoniItem = z.infer<typeof testimoniItemSchema>;

// === System Prompt ===

const VIBE_GUIDE = {
  casual: `VIBE CASUAL (santai, kekinian):
- Bahasa: pakai "kamu/kita/yuk", jangan formal
- Kata-kata: "asik", "enak", "ngopi", "hangout", "bestie", "santai"
- Tone: hangat, ramah, seperti ngobrol sama teman
- Cocok untuk: Kafe, Laundry, Barbershop casual, Jajanan`,

  professional: `VIBE PROFESSIONAL (sopan, terpercaya):
- Bahasa: pakai "Anda/kami", sopan dan percaya diri
- Kata-kata: "terpercaya", "berpengalaman", "solusi", "layanan prima", "profesional"
- Tone: meyakinkan, berorientasi hasil, jelas
- Cocok untuk: Bimbel, Klinik, Jasa Hukum/Keuangan, Konsultan`,

  elegant: `VIBE ELEGANT (mewah, eksklusif):
- Bahasa: pakai "Anda", puitis tapi tidak berlebihan
- Kata-kata: "eksklusif", "premium", "pengalaman", "terbaik", "kustom"
- Tone: tenang, sophisticated, understated luxury
- Cocok untuk: Spa premium, Butik, Restoran fine dining, Galeri seni`,
};

const SYSTEM_PROMPT_STRUCTURED = `Kamu adalah **Cus Engine**, asisten AI internal untuk platform Cus.site.

TUGAS: Generate copywriting website UMKM Bahasa Indonesia yang natural, persuasif, dan siap pakai untuk sebuah bisnis lokal.

═══════════════════════════════════════
SCHEMA JSON YANG WAJIB DIIKUTI (EXACT)
═══════════════════════════════════════
Output HARUS persis seperti ini (nama field PERSIS seperti di bawah, jangan diganti/disingkat/dialias):

{
  "heroHeadline": "string, 10-80 char, headline utama",
  "heroSubtext": "string, 15-150 char, sub-headline",
  "aboutParagraph": "string, 80-500 char, paragraf tentang bisnis (WAJIB sebut nama & lokasi)",
  "ctaText": "string, 2-25 char, teks tombol CTA",
  "seoTitle": "string, 20-60 char, judul untuk tab browser & Google",
  "seoDescription": "string, 60-160 char, deskripsi untuk hasil pencarian",
  "accentColor": "string hex 6 char tanpa #, contoh: f59e0b",
  "services": [
    {
      "title": "string, 3-60 char",
      "description": "string, 20-400 char, deskripsi 1-3 kalimat persuasif"
    }
  ],
  "testimoni": [
    { "nama": "string, nama pelanggan Indonesia realistis", "teks": "string, 20-200 char, review positif natural" },
    { "nama": "string", "teks": "string" },
    { "nama": "string", "teks": "string" }
  ]
}

JANGAN tambah field lain di luar schema (businessName, tagline, dll JANGAN ADA).
JANGAN ubah nama field (pakai 'heroSubtext' BUKAN 'heroSubheadline', dll).

═══════════════════════════════════════
ATURAN KETAT
═══════════════════════════════════════
1. Output HARUS JSON valid. Tidak ada markdown, tidak ada komentar.
2. DILARANG KERAS placeholder: "Lorem Ipsum", "[Alamat]", "xxx", "ABC". Semua teks konkret dari input.
3. Jumlah array 'services' WAJIB PERSIS SAMA dengan jumlah layanan di input.
4. Setiap title/description di services UNIK dan SPESIFIK.
5. Bahasa Indonesia natural, sesuai kultur lokal.
6. aboutParagraph WAJIB sebut nama bisnis dan lokasi spesifik.
7. accentColor: Casual=warm (f59e0b, dc2626, ea580c), Professional=blue (2563eb, 1e40af), Elegant=earth/gold (a16207, 92400e).
8. testimoni: SELALU 3 item, nama Indonesia realistis, teks review natural sesuai vibe.

═══════════════════════════════════════
PANDUAN VIBE & TONE
═══════════════════════════════════════
{VIBE_GUIDE}

CONTEXT BISNIS:
- Nama: {NAMA_BISNIS}
- Jenis: {JENIS_BISNIS}
- Lokasi: {LOKASI}
- WhatsApp: {WHATSAPP}
- Vibe: {VIBE}

LAYANAN (1:1 dengan output services):
{LAYANAN_LIST}

Eksekusi sekarang. Output JSON saja.`;

/**
 * Versi prompt yang lebih eksplisit untuk mode fallback (tanpa Structured
 * Outputs). Tambahkan instruksi hard "return HANYA JSON, tidak ada markdown".
 *
 * Reasoning models (DeepSeek R1, MiniMax thinking mode, dll) sering output
 * tag  sebelum JSON. Prompt ini tegas: JANGAN pakai thinking tag,
 * langsung JSON aja.
 */
const SYSTEM_PROMPT_JSON_ONLY = `${SYSTEM_PROMPT_STRUCTURED}

PENTING TAMBAHAN (untuk mode JSON-only):
- Kembalikan response HANYA sebagai JSON object tanpa markdown code block
- JANGAN bungkus dengan \`\`\`json atau \`\`\`
- JANGAN tambahkan penjelasan sebelum atau sesudah JSON
- JANGAN gunakan tag reasoning seperti  atau [THINK] atau teks lain di luar JSON
- Mulai response langsung dengan karakter '{' dan akhiri dengan '}'
- Response pertama kamu = karakter '{'. Tidak ada teks sebelumnya.`;

function buildSystemPrompt(
  input: WizardInput,
  mode: "structured" | "json-only",
): string {
  const template =
    mode === "structured" ? SYSTEM_PROMPT_STRUCTURED : SYSTEM_PROMPT_JSON_ONLY;

  return template
    .replace("{VIBE_GUIDE}", VIBE_GUIDE[input.vibe])
    .replace("{NAMA_BISNIS}", input.namaBisnis)
    .replace("{JENIS_BISNIS}", input.jenisBisnis)
    .replace("{LOKASI}", input.lokasi)
    .replace("{WHATSAPP}", input.whatsapp)
    .replace("{VIBE}", input.vibe)
    .replace(
      "{LAYANAN_LIST}",
      input.layanan
        .map((l, i) => `${i + 1}. ${l.title}: ${l.description}`)
        .join("\n"),
    );
}

function buildUserPrompt(input: WizardInput): string {
  const layananList = input.layanan
    .map(
      (l, i) =>
        `${i + 1}. title: "${l.title}" | description user: "${l.description}"`,
    )
    .join("\n");

  return `Generate copywriting untuk bisnis ini. Ingat: services.length harus PERSIS ${input.layanan.length}.

INPUT BISNIS:
- Nama: ${input.namaBisnis}
- Jenis: ${input.jenisBisnis}
- Lokasi: ${input.lokasi}
- WhatsApp: ${input.whatsapp}
- Vibe: ${input.vibe}

INPUT LAYANAN (${input.layanan.length} item, harus di-enhance 1:1):
${layananList}

Kembalikan JSON valid sesuai schema.`;
}

// === Main export ===

export type GenerateKontenResult =
  | { success: true; data: KontenAI; mode: "structured" | "json-only" }
  | {
      success: false;
      error: string;
      rawResponse?: string;
      cleanedPreview?: string;
    };

/**
 * Cus Engine: generate structured copywriting untuk 1 bisnis.
 *
 * @param input - Data wizard (nama, jenis, lokasi, whatsapp, vibe, layanan)
 * @returns Result dengan data ter-parse (mode: 'structured' atau 'json-only')
 */
export async function generateCusWebsite(
  input: WizardInput,
): Promise<GenerateKontenResult> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "OPENAI_API_KEY belum di-set di .env.local",
    };
  }

  // === Attempt 1: Structured Outputs (preferred) ===
  const structuredResult = await tryStructuredOutput(input);
  if (structuredResult.ok) {
    return { success: true, data: structuredResult.data, mode: "structured" };
  }

  // Kalau error TIDAK terkait structured output (misal API key invalid),
  // langsung return error — gak perlu fallback.
  if (!structuredResult.shouldFallback) {
    return { success: false, error: structuredResult.error };
  }

  console.warn(
    "[ai] Structured Outputs not supported, falling back to JSON prompt mode",
  );

  // === Attempt 2: JSON prompt + manual parse ===
  return tryJsonOnlyMode(input);
}

// === Attempt 1: Structured Outputs ===

type AttemptResult =
  | { ok: true; data: KontenAI }
  | { ok: false; error: string; shouldFallback: boolean };

async function tryStructuredOutput(input: WizardInput): Promise<AttemptResult> {
  try {
    const { zodResponseFormat } = require("openai/helpers/zod") as {
      zodResponseFormat: (s: z.ZodTypeAny, n: string) => any;
    };

    const completion = await getClient().beta.chat.completions.parse({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(input, "structured") },
        { role: "user", content: buildUserPrompt(input) },
      ],
      response_format: zodResponseFormat(kontenAISchema, "cus_content_schema"),
      temperature: 0.8,
    });

    const message = completion.choices[0]?.message;
    if (!message)
      return {
        ok: false,
        error: "AI return empty response",
        shouldFallback: false,
      };

    if (message.refusal) {
      return {
        ok: false,
        error: `AI menolak: ${message.refusal}`,
        shouldFallback: false,
      };
    }

    const rawParsed = message.parsed;
    if (!rawParsed) {
      return {
        ok: false,
        error: "Structured parse gagal (parsed=null)",
        shouldFallback: false,
      };
    }

    // Zod validate ulang sebagai safety net
    const parsed: KontenAI = kontenAISchema.parse(rawParsed);

    return validateOutput(parsed, input);
  } catch (err) {
    console.error("[ai] structured attempt error:", err);

    if (err instanceof OpenAI.APIError) {
      // Cek apakah error karena response_format tidak didukung
      const isUnsupportedFeature =
        err.status === 400 &&
        (err.message.toLowerCase().includes("response_format") ||
          err.message.toLowerCase().includes("structured") ||
          err.message.toLowerCase().includes("json_schema") ||
          err.message.toLowerCase().includes("unsupported"));

      return {
        ok: false,
        error: `API error: ${err.message}`,
        shouldFallback: isUnsupportedFeature,
      };
    }

    // SyntaxError dari JSON.parse — terjadi saat SDK coba parse response
    // yang ternyata BUKAN JSON (misal model return `{"text":"..."}` thinking
    // + markdown, atau sama sekali bukan JSON). Tanda model gak support
    // Structured Outputs / Strict JSON Schema.
    if (err instanceof SyntaxError) {
      return {
        ok: false,
        error: `Model response bukan JSON valid (${err.message.slice(0, 100)})`,
        shouldFallback: true,
      };
    }

    if (err instanceof z.ZodError) {
      return {
        ok: false,
        error: `Schema mismatch: ${err.issues.map((i) => i.message).join(", ")}`,
        shouldFallback: false,
      };
    }

    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
      shouldFallback: false,
    };
  }
}

// === Attempt 2: JSON-only prompt + manual parse ===

async function tryJsonOnlyMode(
  input: WizardInput,
): Promise<GenerateKontenResult> {
  try {
    const completion = await getClient().chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(input, "json-only") },
        { role: "user", content: buildUserPrompt(input) },
      ],
      temperature: 0.8,
      // Tidak ada response_format — kita minta di prompt
    });

    const message = completion.choices[0]?.message;
    if (!message) {
      return { success: false, error: "AI return empty response" };
    }

    if (message.refusal) {
      return { success: false, error: `AI menolak: ${message.refusal}` };
    }

    const rawContent = message.content ?? "";
    const parsed = extractAndParseJson(rawContent);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
        rawResponse: rawContent,
        cleanedPreview: parsed.cleanedPreview,
      };
    }

    const validated = validateOutput(parsed.data, input);
    if (!validated.ok) {
      return {
        success: false,
        error: validated.error,
        rawResponse: rawContent,
      };
    }

    return {
      success: true,
      data: validated.data,
      mode: "json-only",
    };
  } catch (err) {
    console.error("[ai] json-only attempt error:", err);

    if (err instanceof OpenAI.APIError) {
      return { success: false, error: `API error: ${err.message}` };
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// === Helpers ===

function extractAndParseJson(
  raw: string,
):
  | { success: true; data: KontenAI }
  | { success: false; error: string; cleanedPreview?: string } {
  let cleaned = raw.trim();

  // Strip 1: chain-of-thought block  (khas reasoning models
  // seperti DeepSeek R1, MiniMax thinking mode, Qwen QwQ, dll).
  // Bisa muncul多次 dan nested dalam teks. Pakai regex global.
  cleaned = cleaned.replace(/<think(?:ing)?>[\s\S]*?<\/think(?:ing)?>/gi, "");

  // Sanity check: kalau response masih dimulai dengan '<', kemungkinan
  // HTML error page (502, 503, dll) — bukan JSON.
  if (cleaned.trimStart().startsWith("<")) {
    const preview = cleaned.slice(0, 200);
    return {
      success: false,
      error: `Response bukan JSON (mulai dengan '<'). Preview: ${preview.replace(/\s+/g, " ").slice(0, 120)}`,
    };
  }

  // Strip 2: markdown code block wrapper ```json ... ``` atau ``` ... ```
  const fenceMatch = cleaned.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Strip 3: prefix/suffix teks non-JSON (kalau AI nambah "Berikut JSON: ")
  // Cari JSON object utama: ambil { pertama sampai } terakhir.
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    return {
      success: false,
      error: "Response tidak mengandung JSON object yang valid",
      cleanedPreview: cleaned.slice(0, 300),
    };
  }
  cleaned = cleaned.slice(jsonStart, jsonEnd + 1);

  let json: unknown;
  try {
    json = JSON.parse(cleaned);
  } catch (e) {
    return {
      success: false,
      error: `JSON parse gagal: ${e instanceof Error ? e.message : "invalid"}`,
      cleanedPreview: cleaned.slice(0, 300),
    };
  }

  // Validate via Zod
  const result = kontenAISchema.safeParse(json);
  if (!result.success) {
    return {
      success: false,
      error: `Schema mismatch: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
      cleanedPreview: JSON.stringify(json).slice(0, 500),
    };
  }

  return { success: true, data: result.data };
}

function validateOutput(parsed: KontenAI, input: WizardInput): AttemptResult {
  // Post-validation: 1:1 mapping check
  if (parsed.services.length !== input.layanan.length) {
    return {
      ok: false,
      error: `Jumlah services (${parsed.services.length}) tidak match dengan input (${input.layanan.length}).`,
      shouldFallback: false,
    };
  }

  // Post-validation: placeholder check
  const placeholderRegex =
    /(lorem ipsum|\[alamat\]|\[nama\]|\[no hp\]|xxx|placeholder|contoh:)/i;
  const allText = [
    parsed.heroHeadline,
    parsed.heroSubtext,
    parsed.aboutParagraph,
    parsed.ctaText,
    parsed.seoTitle,
    parsed.seoDescription,
    ...parsed.services.flatMap((s) => [s.title, s.description]),
  ].join(" ");

  if (placeholderRegex.test(allText)) {
    return {
      ok: false,
      error: "Output mengandung placeholder.",
      shouldFallback: false,
    };
  }

  return { ok: true, data: parsed };
}
