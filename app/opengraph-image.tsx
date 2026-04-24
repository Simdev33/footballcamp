import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Kickoff Elite Football Camps — Nemzetközi futballtáborok"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(212,160,23,0.22) 0%, transparent 55%), linear-gradient(135deg, #0a1f0a 0%, #0d260d 60%, #061406 100%)",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          color: "#ffffff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(90deg, transparent 0 60px, rgba(255,255,255,0.03) 60px 61px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              border: "2px solid #d4a017",
              background:
                "radial-gradient(circle at 30% 30%, #1b3a1b 0%, #0a1f0a 70%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#d4a017",
              fontWeight: 800,
            }}
          >
            K
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1,
            }}
          >
            <span
              style={{
                color: "#d4a017",
                fontSize: 18,
                letterSpacing: 6,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Kickoff Elite
            </span>
            <span
              style={{
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 600,
                marginTop: 6,
              }}
            >
              Football Camps
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            position: "relative",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              padding: "10px 22px",
              border: "1px solid rgba(212,160,23,0.5)",
              background: "rgba(212,160,23,0.1)",
              color: "#d4a017",
              fontSize: 22,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 4,
              alignSelf: "flex-start",
            }}
          >
            Nemzetközi futballtáborok
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            <span style={{ color: "#ffffff" }}>Adj gyermekednek</span>
            <span style={{ color: "#d4a017" }}>valódi élményt.</span>
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 30,
              fontWeight: 500,
              maxWidth: 900,
              lineHeight: 1.25,
            }}
          >
            Top európai akadémiák módszerei · külföldi edzők · Szeged & Kecskemét · 7–15 év
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(255,255,255,0.55)",
            fontSize: 22,
            position: "relative",
            borderTop: "1px solid rgba(212,160,23,0.2)",
            paddingTop: 24,
          }}
        >
          <span>kickoffcamps.hu</span>
          <span style={{ color: "#d4a017", fontWeight: 700 }}>
            Jelentkezés nyitva →
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
