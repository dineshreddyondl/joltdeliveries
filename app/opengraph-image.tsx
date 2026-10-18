import { ImageResponse } from "next/og";

export const alt =
  "JOLT — India's rail-first express network for 200kg+ B2B";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG share card — dark brand card with the JOLT bolt and the
 * claim-corrected tagline. Text-only (no bundled fonts) to keep the
 * edge bundle light.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080A",
          padding: 64,
          color: "#FBFCF8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#E85A2C" />
            <path d="M36.5 8 15 36.5h12.5L27.5 56 49 27.5H36.5Z" fill="#08080A" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
            JOLT
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>
            India&apos;s rail-first express network for 200kg+ B2B.
          </div>
          <div style={{ fontSize: 28, color: "#8B8B90" }}>
            Next Train Out. Next-day heavy commerce. Guaranteed SLAs.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
