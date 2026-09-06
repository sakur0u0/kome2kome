import { cn } from "@/lib/utils/cn";

interface InkEdgeProps {
  /** 塗りの色（下に続く幕の色）。CSS カラー */
  fill?: string;
  /** 上向き（次の幕が上から侵食する）/ 下向き */
  direction?: "down" | "up";
  className?: string;
}

/**
 * 幕と幕の境目に置く「墨の縁」。
 * 筆でなぞったような不揃いな輪郭と、垂れた墨の粒で、和紙 → 墨 の暗転をつなぐ。
 * 直前の幕の末尾に絶対配置し、fill は次の幕の背景色に合わせる。
 */
export function InkEdge({ fill = "#1a1a1a", direction = "down", className }: InkEdgeProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 h-16 md:h-24",
        direction === "down" ? "bottom-0" : "top-0 rotate-180",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-full w-full"
        fill={fill}
      >
        {/* 掠れた筆の縁 */}
        <path d="M0 120 L0 74 C60 62 110 90 170 80 C230 70 260 44 330 54 C400 64 420 96 490 88 C560 80 590 52 660 58 C730 64 760 92 830 84 C900 76 930 48 1000 56 C1070 64 1090 94 1160 86 C1230 78 1260 50 1330 60 C1380 67 1410 84 1440 78 L1440 120 Z" />
        {/* 二筆目：少し薄く、上に重ねて濃淡を作る */}
        <path
          opacity="0.55"
          d="M0 120 L0 92 C80 86 140 100 220 94 C300 88 340 70 420 76 C500 82 540 104 620 98 C700 92 740 72 820 78 C900 84 940 106 1020 100 C1100 94 1140 74 1220 80 C1300 86 1360 98 1440 92 L1440 120 Z"
        />
        {/* 垂れた墨 */}
        <ellipse cx="212" cy="42" rx="5" ry="9" opacity="0.8" />
        <circle cx="222" cy="24" r="2.2" opacity="0.7" />
        <ellipse cx="884" cy="40" rx="4" ry="8" opacity="0.75" />
        <circle cx="1008" cy="36" r="3" opacity="0.7" />
        <circle cx="1020" cy="20" r="1.6" opacity="0.6" />
        <ellipse cx="1292" cy="44" rx="3.5" ry="7" opacity="0.7" />
      </svg>
    </div>
  );
}
