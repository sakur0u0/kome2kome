import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface WashiTextureProps {
  className?: string;
  /** 0〜1 */
  opacity?: number;
}

/**
 * 和紙の質感。明るい幕の背景に敷き、繊維の流れとわずかな陰影を与える。
 * タイル画像ではなく、領域全体にひとつの feTurbulence を掛けるので継ぎ目が出ない。
 */
export function WashiTexture({ className, opacity = 0.16 }: WashiTextureProps) {
  const id = useId().replace(/:/g, "");
  const fiber = `washi-fiber-${id}`;
  const grain = `washi-grain-${id}`;

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg className="absolute inset-0 h-full w-full mix-blend-multiply" style={{ opacity }}>
        <defs>
          {/* 繊維の流れ（横方向に長い、やわらかな濃淡） */}
          <filter id={fiber} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.028" numOctaves="4" seed="11" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.05 0.45 0.75" />
            </feComponentTransfer>
          </filter>
          {/* 紙の粒（細かなざらつき） */}
          <filter id={grain} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0 0.35" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${fiber})`} />
        <rect width="100%" height="100%" filter={`url(#${grain})`} opacity="0.5" />
      </svg>
      {/* 紙の周縁の陰り */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(26,26,26,0.07)_100%)]" />
    </div>
  );
}
