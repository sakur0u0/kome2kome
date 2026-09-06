# 米と米 京都祇園店 — コンセプト LP

京都・祇園、八坂神社のそば。こだわり抜いたお米を直接卸し、米粉クレープと目の前で絞る
「お米のモンブラン」に仕立てる **お米の専門店** のランディングページです。
3 ヶ国語（日本語 / English / 简体中文）対応。

> 「食べ歩きなのに、この豪華さ。それが米と米。」
> 水墨の世界（和紙 × 墨）から、朱を経て、漆黒 × 金へ。スクロールにつれて豪華になっていく構成です。

- **Next.js 16**（App Router / Turbopack）+ **TypeScript**
- **Tailwind CSS v4**（`@theme` によるデザイントークン、`data-tone` による幕ごとの前景色切替）
- **Framer Motion**（スクロール連動 / sticky 演出 / 筆順アニメ / 言語切替クロスフェード）
- **next/font**（Noto Serif JP / Noto Serif SC / Yuji Syuku（筆文字）/ Cinzel / Playfair Display / Inter）
- **KanjiVG**（漢字の筆順パス。CC BY-SA 3.0 — フッターにクレジット表記）

**公開 URL:** https://sakur0u0.github.io/kome2kome/ （GitHub Pages。`main` へ push すると自動で再デプロイ）

## 起動方法

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # 本番ビルド
npm run start    # 本番サーバー
npm run lint     # ESLint
```

## デプロイ（GitHub Pages）

- リポジトリ: https://github.com/sakur0u0/kome2kome
- `.github/workflows/pages.yml` が `main` への push ごとに **静的エクスポート**（`next build` with `STATIC_EXPORT=1`）→ `out/` を Pages に配置します。
- `NEXT_PUBLIC_BASE_PATH`（= `/kome2kome`）は `actions/configure-pages` が自動で渡します。`public/` の画像パスは `site.config.ts` で basePath を前置しています。
- 静的エクスポート時は `next/image` の最適化 API が使えないため `images.unoptimized: true` になります（ローカルの `next dev` / `next start` は従来どおり最適化あり）。
- 手元で同じ出力を確認するには:

```bash
STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/kome2kome npm run build   # → out/
```

- 独自ドメインや画像最適化・OG 画像生成が必要になったら Vercel への移行が最短です（`npx vercel` でログイン → そのままデプロイ可。環境変数は不要）。

## ページ構成（七章）

| 章 | id | 幕（トーン） | 内容 / 主な演出 |
| --- | --- | --- | --- |
| — Hero | `top` | 漆黒 | ロゴ（白丸・筆文字「米」・朱の落款）、キャッチ、CTA「Google マップで経路」 |
| 壱 宣言 | `manifesto` | 和紙 | 松林図屏風の気配、筆順で描かれる「米」、縦書きの宣言文、墨の滲みで現れる本文 |
| 弐 こだわり | `craft` | 和紙 | 3 柱（米 / 米粉 / 体験）。写真がモノクロから色を取り戻す `ColorAwakening` |
| 参 品書き | `menu` | 墨 | 巻物の横スクロール（sticky）。金縁カード、3D チルト、名物 / 季節限定バッジ |
| 四 体験 | `ritual` | 漆黒 | スクロール量でお米のクリームが器に積み重なる線描 → ポン菓子・ごま塩 → 金の光 |
| 五 お米 | `rice` | 漆黒 | 持ち帰るお米。3 つの要点、筆順「米」 |
| 六 空気 | `air` | 漆黒 | 祇園の路地・八坂神社のパララックスギャラリー |
| 七 道 | `way` | 漆黒 × 金 | 墨線で引かれるアクセス地図、店舗情報、金の CTA |

## ディレクトリ構成

```
src/
├─ app/
│  ├─ layout.tsx            # メタデータ / JSON-LD（FoodEstablishment）/ フォント変数 / Provider
│  ├─ page.tsx              # 七章の組み立て + GoldLeafCanvas / NoiseOverlay / InkCursor
│  ├─ fonts.ts              # next/font/google（言語別 + 筆文字 Yuji Syuku）
│  └─ globals.css           # トークン（和紙/墨/薄墨/朱/金）、data-tone、ink-mask などのユーティリティ
├─ components/
│  ├─ layout/               # Header（トーン追従ガラス）/ LanguageToggle / MobileMenu（暖簾）/ Footer / navigation
│  ├─ sections/             # Hero / Manifesto / Craft / Menu / Ritual / Rice / Air / Way
│  ├─ motion/               # InkReveal / BrushKanji / ColorAwakening / VerticalType / FadeSwap / Reveal
│  ├─ effects/              # GoldLeafCanvas（金箔）/ InkCursor（墨のカーソル）
│  ├─ providers/            # AppProviders（LanguageProvider + MotionConfig）
│  └─ ui/                   # ChapterHeading / SealStamp / InkEdge / WashiTexture / MenuCard / MonbranDrawing / InkMap / GoldButton / Logo …
├─ hooks/                   # useScrollReveal / useParallax(Zoom) / useScrolled / useHeaderTone / useMediaQuery
└─ lib/
   ├─ site.config.ts        # 店舗情報・リンク・画像パス・品書き・章の装飾漢字（文言以外の差し替え口）
   ├─ kanji/strokes.ts      # KanjiVG 由来の筆順パス（米・極・味・静・縁・道）
   ├─ i18n/                 # 型 / ストア / 辞書（ja・en・zh）
   └─ motion/               # transitions / variants
public/img/placeholder/      # 仮素材（Wikimedia Commons）。出典は同ディレクトリの CREDITS.md
docs/                        # 調査・提案・実装計画・QA レポート
```

## 日本的アニメーションの部品

| 部品 | 仕組み |
| --- | --- |
| `InkReveal` | feTurbulence で歪ませた円を `mask-image` に使い、`mask-size` を 0% → 320% へ遷移（墨が紙に滲む） |
| `BrushKanji` | KanjiVG の筆順パスを `pathLength` で一画ずつ描く。フィルタで滲み・かすれ |
| `SealStamp` | 朱の落款。スプリングで「押される」 |
| `ColorAwakening` | スクロール位置で `grayscale / sepia / contrast` を補間（墨 → 色） |
| `VerticalType` | 縦書き 1 字 stagger（英語は横書きにフォールバック） |
| `InkEdge` | 幕の境目の墨の飛沫（SVG） |
| `WashiTexture` | 領域全体にひとつの feTurbulence を掛けた和紙（タイルの継ぎ目なし） |
| `MonbranDrawing` | 84 本のベジェ曲線を決定的乱数で生成し、スクロール進捗で下から順に描く |
| `InkMap` | 鴨川・四条通・花見小路・八坂神社を墨線で引くアクセス地図 |
| `GoldLeafCanvas` | Canvas の金箔。ページ後半で密度が増す。画面面積でスケール、reduced-motion で停止 |
| `InkCursor` | PC のみ。墨の点 + 金の輪。リンク上で膨らむ |

OS の「視差効果を減らす」設定は `MotionConfig reducedMotion="user"` と各部品の `useReducedMotion` で尊重します。

## 多言語の仕組み

- 右上のトグル（JP / EN / CN）で `localeStore.set()` → `useSyncExternalStore` 経由で全体が再描画。選択は `localStorage`（`kome2kome.locale`）に保存。
- 初回訪問時は `navigator.languages` から自動判定（ja / zh / それ以外 → English）。サーバー描画は日本語固定、ハイドレーション後に切替。
- `<html lang>` と `data-lang` を同期し、`globals.css` で見出し・本文のフォントスタックを言語別に切替。
- 文言は `src/lib/i18n/dictionaries/*.ts` に集約。`Dictionary` 型で 3 言語の網羅性を保証。

## カスタマイズ箇所

| 変えたいもの | 場所 |
| --- | --- |
| 店名・落款・Instagram | `src/lib/site.config.ts` → `brand` |
| 住所・営業時間 | `src/lib/site.config.ts` → `location`（住所は `way.address`〈辞書〉にも） |
| 写真 | `src/lib/site.config.ts` → `images`（実写真は `public/img/` へ置き、パスを差し替え） |
| 品書き（価格・名物・季節限定） | `src/lib/site.config.ts` → `menu`、名称・説明は辞書の `menu.items` |
| 文言（3 ヶ国語） | `src/lib/i18n/dictionaries/{ja,en,zh}.ts` |
| 配色・フォント・余白 | `src/app/globals.css` の `@theme inline` / `[data-tone]` |
| アニメーションの速さ | `src/lib/motion/transitions.ts`、各部品の `duration` prop |
| 章の装飾漢字を増やす | `src/lib/kanji/strokes.ts` に KanjiVG のパスを追加 |

## 公開前に差し替えるもの

- `public/img/placeholder/` の仮素材 → 実写真（商品・店内・祇園の路地）。出典と用途は `CREDITS.md` を参照
- ヒーロー背景（Unsplash）→ 店舗 / 商品写真
- お米の品種・産地・価格（現在は「店頭 / Instagram にて」表記）
- 定休日（現在は「Instagram にてご確認ください」）
- 店名の由来（「食べる米と、持ち帰る米。」は仮の解釈）
- 英語・中国語コピーのネイティブチェック
