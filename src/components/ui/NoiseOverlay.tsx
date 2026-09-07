/**
 * 画面全体に極薄のフィルムグレインを重ね、黒ベースの階調に質感を与える。
 * SVG の feTurbulence を data URI で背景に敷くだけの軽量な実装。
 * mix-blend-mode は使わない（固定レイヤーにブレンドがあると Safari はスクロールごとに
 * ページ全体を再合成してカクつく）。通常合成でも粒の質感は十分に出る。
 */
const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#n)"/>
    </svg>`,
  );

export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.035]"
      style={{ backgroundImage: `url("${NOISE_SVG}")`, backgroundSize: "220px 220px" }}
    />
  );
}
