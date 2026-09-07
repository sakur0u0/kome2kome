import { siteConfig } from "@/lib/site.config";
import { cn } from "@/lib/utils/cn";

interface WashiTextureProps {
  className?: string;
  /** 0〜1 */
  opacity?: number;
}

/**
 * 和紙の質感。明るい幕の背景に敷き、繊維の流れとわずかな陰影を与える。
 *
 * 事前生成した継ぎ目なしのタイル（public/img/texture/washi-tile.webp、640px、FFT で周期化したノイズ）
 * を背景画像として繰り返すだけ。ランタイムで feTurbulence を大面積に掛けない・
 * mix-blend-mode も使わないので、モバイル Safari でも初回描画とスクロールが軽い。
 */
export function WashiTexture({ className, opacity = 0.16 }: WashiTextureProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${siteConfig.images.washiTile.src}")`,
          backgroundSize: "640px 640px",
          backgroundRepeat: "repeat",
          opacity,
        }}
      />
      {/* 紙の周縁の陰り */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(26,26,26,0.07)_100%)]" />
    </div>
  );
}
