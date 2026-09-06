import type { NextConfig } from "next";

/**
 * GitHub Pages 向けの静的エクスポート。
 * CI（.github/workflows/pages.yml）が STATIC_EXPORT=1 と NEXT_PUBLIC_BASE_PATH=/<repo> を渡す。
 * ローカル開発（next dev / next start）では通常の SSR + 画像最適化で動く。
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        basePath,
        // 静的エクスポートでは画像最適化 API が使えないため、素の <img> として出力する
        images: { unoptimized: true },
      }
    : {
        images: {
          remotePatterns: [
            {
              protocol: "https",
              hostname: "images.unsplash.com",
            },
            // 仮素材（Wikimedia Commons）。実写真の受領後に差し替える
            {
              protocol: "https",
              hostname: "upload.wikimedia.org",
            },
          ],
          qualities: [75, 90],
        },
      }),
};

export default nextConfig;
