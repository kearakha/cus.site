import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getBisnisBySubdomain } from "@/lib/db";

export async function GET(request: NextRequest) {
  const subdomain = request.nextUrl.searchParams.get("subdomain");
  if (!subdomain) {
    return new Response("Missing subdomain", { status: 400 });
  }

  const bisnis = await getBisnisBySubdomain(subdomain);
  if (!bisnis || !bisnis.published) {
    return new Response("Not found", { status: 404 });
  }

  const accent = bisnis.kontenAI?.accentColor || "f59e0b";
  const accentHex = `#${accent}`;

  const headline = bisnis.kontenAI?.heroHeadline || bisnis.namaBisnis;
  const sub =
    bisnis.kontenAI?.heroSubtext || `${bisnis.jenisBisnis} · ${bisnis.lokasi}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        backgroundColor: "#0f172a",
        fontFamily: "sans-serif",
      }}
    >
      {/* Accent strip top */}
      <div
        style={{
          width: "80px",
          height: "6px",
          borderRadius: "3px",
          backgroundColor: accentHex,
        }}
      />

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "#f8fafc",
            lineHeight: 1.1,
            maxWidth: "900px",
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          {sub}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "22px", color: "#64748b" }}>
          {subdomain}.cus.site
        </div>
        <div
          style={{
            fontSize: "18px",
            color: accentHex,
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          cus.site
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
