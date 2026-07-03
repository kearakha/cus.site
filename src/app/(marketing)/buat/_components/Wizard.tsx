"use client";

import { useReducer, useState, useTransition, useEffect } from "react";
import { PartyPopper, Sparkles } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { Step1NamaBisnis } from "./Step1NamaBisnis";
import { Step2Kontak } from "./Step2Kontak";
import { Step3Vibe } from "./Step3Vibe";
import { Step4Layanan } from "./Step4Layanan";
import { Step5Subdomain } from "./Step5Subdomain";
import { type StepKey, type SubmitState, buildTenantUrl } from "./steps";
import type { LayananItem } from "@/lib/schemas/wizard";
import { submitBisnisAction, type SubmitResult } from "../actions";
import { AccessLinkCard } from "@/components/AccessLinkCard";

// === State ===

type WizardData = {
  namaBisnis?: string;
  jenisBisnis?: string;
  logoUrl?: string;
  coverUrl?: string;
  lokasi?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  jamBuka?: string;
  jamTutup?: string;
  hariOperasional?: string;
  vibe?: "casual" | "professional" | "elegant";
  layanan: LayananItem[];
  subdomain?: string;
};

type Action =
  | {
      type: "SET_STEP1";
      data: {
        namaBisnis: string;
        jenisBisnis: string;
        logoUrl?: string;
        coverUrl?: string;
      };
    }
  | {
      type: "SET_STEP2";
      data: {
        lokasi: string;
        whatsapp: string;
        email: string;
        instagram?: string;
        tiktok?: string;
        facebook?: string;
        jamBuka?: string;
        jamTutup?: string;
        hariOperasional?: string;
      };
    }
  | { type: "SET_STEP3"; data: { vibe: "casual" | "professional" | "elegant" } }
  | { type: "SET_STEP4"; data: { layanan: LayananItem[] } }
  | { type: "SET_STEP5"; data: { subdomain: string } };

function reducer(state: WizardData, action: Action): WizardData {
  switch (action.type) {
    case "SET_STEP1":
      return { ...state, ...action.data };
    case "SET_STEP2":
      return { ...state, ...action.data };
    case "SET_STEP3":
      return { ...state, ...action.data };
    case "SET_STEP4":
      return { ...state, layanan: action.data.layanan };
    case "SET_STEP5":
      return { ...state, subdomain: action.data.subdomain };
  }
}

const STORAGE_KEY = "cus_wizard_draft";
const INITIAL: WizardData = { layanan: [{ title: "", description: "" }] };

function loadDraft(): WizardData {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL;
  } catch {
    return INITIAL;
  }
}

// === Container ===

export function Wizard() {
  const [data, dispatch] = useReducer(reducer, undefined, loadDraft);
  const [step, setStep] = useState<StepKey>(1);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const goNext = () => setStep((s) => Math.min(5, s + 1) as StepKey);
  const goBack = () => setStep((s) => Math.max(1, s - 1) as StepKey);

  const handleSubmit = () => {
    if (!data.subdomain) return;

    setSubmitState({ status: "submitting" });

    startTransition(async () => {
      const result = await submitBisnisAction({
        namaBisnis: data.namaBisnis!,
        jenisBisnis: data.jenisBisnis!,
        logoUrl: data.logoUrl || undefined,
        coverUrl: data.coverUrl || undefined,
        lokasi: data.lokasi!,
        whatsapp: data.whatsapp!,
        email: data.email!,
        instagram: data.instagram || undefined,
        tiktok: data.tiktok || undefined,
        facebook: data.facebook || undefined,
        jamBuka: data.jamBuka || undefined,
        jamTutup: data.jamTutup || undefined,
        hariOperasional: data.hariOperasional || undefined,
        vibe: data.vibe!,
        subdomain: data.subdomain!,
        layanan: data.layanan,
      });

      if (!result.success) {
        setSubmitState({ status: "error", message: result.error });
        return;
      }

      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
      const tenantUrl = buildTenantUrl(result.subdomain);
      setSubmitState({
        status: "success",
        subdomain: result.subdomain,
        url: tenantUrl,
        accessLink: result.accessLink,
      });

      // Tampilkan UI sukses sebentar, lalu redirect ke subdomain.
      setTimeout(() => {
        window.location.href = tenantUrl;
      }, 4000); // kasih waktu lebih lama biar user bisa copy link
    });
  };

  // === Loading state saat submitting → overlay full ===
  if (submitState.status === "submitting" || submitState.status === "success") {
    return <GeneratingOverlay state={submitState} />;
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
      <ProgressBar current={step} />

      {step === 1 && (
        <Step1NamaBisnis
          defaultValues={{
            namaBisnis: data.namaBisnis ?? "",
            jenisBisnis: data.jenisBisnis,
            logoUrl: data.logoUrl,
            coverUrl: data.coverUrl,
          }}
          onNext={(values) => {
            dispatch({ type: "SET_STEP1", data: values });
            goNext();
          }}
        />
      )}

      {step === 2 && (
        <Step2Kontak
          defaultValues={{
            lokasi: data.lokasi ?? "",
            whatsapp: data.whatsapp ?? "",
            email: data.email,
            instagram: data.instagram,
            tiktok: data.tiktok,
            facebook: data.facebook,
            jamBuka: data.jamBuka,
            jamTutup: data.jamTutup,
            hariOperasional: data.hariOperasional,
          }}
          onBack={goBack}
          onNext={(values) => {
            dispatch({ type: "SET_STEP2", data: values });
            goNext();
          }}
        />
      )}

      {step === 3 && (
        <Step3Vibe
          defaultValue={data.vibe}
          onBack={goBack}
          onNext={(value) => {
            dispatch({ type: "SET_STEP3", data: { vibe: value } });
            goNext();
          }}
        />
      )}

      {step === 4 && (
        <Step4Layanan
          defaultValues={data.layanan}
          onBack={goBack}
          onNext={(values) => {
            dispatch({ type: "SET_STEP4", data: { layanan: values } });
            goNext();
          }}
        />
      )}

      {step === 5 && (
        <Step5Subdomain
          defaultValue={data.subdomain ?? ""}
          bisnisName={data.namaBisnis ?? ""}
          onBack={goBack}
          onGenerate={(subdomain) => {
            dispatch({ type: "SET_STEP5", data: { subdomain } });
            handleSubmit();
          }}
        />
      )}

      {submitState.status === "error" && (
        <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-900">
            Gagal membuat website
          </p>
          <p className="text-sm text-red-700 mt-1">{submitState.message}</p>
          <button
            type="button"
            onClick={() => setSubmitState({ status: "idle" })}
            className="mt-3 text-xs font-medium text-red-700 underline hover:text-red-900"
          >
            Coba lagi
          </button>
        </div>
      )}
    </div>
  );
}

// === Generating overlay ===

function GeneratingOverlay({ state }: { state: SubmitState }) {
  if (state.status === "submitting") {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-12 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        <h2 className="mt-6 text-xl font-semibold">
          AI lagi nulis copywriting...
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sabar ya, biasanya 10-30 detik.
        </p>
      </div>
    );
  }

  if (state.status === "success") {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-10 text-center space-y-6">
        <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <PartyPopper className="h-6 w-6 text-emerald-600" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Website kamu sudah jadi!</h2>
          <p className="mt-2 text-sm text-slate-600">
            Mengarahkan kamu ke{" "}
            <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">
              {state.subdomain}.cus.site
            </code>
            ...
          </p>
        </div>

        {/* Access link — penting! Simpan ini supaya bisa akses dashboard lagi nanti */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
          <h3 className="text-sm font-semibold text-amber-900 inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            Simpan link ini!
          </h3>
          <p className="text-xs text-amber-800 mt-1 mb-3">
            Untuk kembali ke dashboard & edit website kamu lain kali (kalau
            clear cookies / ganti device).
          </p>
          <AccessLinkCard link={state.accessLink} label="Copy" />
        </div>

        <p className="text-xs text-slate-400">
          Kalau tidak redirect otomatis,{" "}
          <a href={state.url} className="underline hover:text-slate-700">
            klik di sini
          </a>
          .
        </p>
      </div>
    );
  }

  // idle / error (seharusnya tidak render overlay)
  return null;
}
