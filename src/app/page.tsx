import { GoldLeafCanvas } from "@/components/effects/GoldLeafCanvas";
import { InkCursor } from "@/components/effects/InkCursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { AirSection } from "@/components/sections/AirSection";
import { CraftSection } from "@/components/sections/CraftSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { MenuSection } from "@/components/sections/MenuSection";
import { RiceSection } from "@/components/sections/RiceSection";
import { RitualSection } from "@/components/sections/RitualSection";
import { WaySection } from "@/components/sections/WaySection";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";

/**
 * 一巻の絵巻物として構成した LP。
 * 序（漆黒）→ 壱・弐（和紙 × 墨）→ 参（墨 × 朱）→ 四〜七（漆黒 × 金）→ 結
 */
export default function Page() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" className="relative">
        <HeroSection />
        <ManifestoSection />
        <CraftSection />
        <MenuSection />
        <RitualSection />
        <RiceSection />
        <AirSection />
        <WaySection />
      </main>
      <Footer />
      <GoldLeafCanvas />
      <NoiseOverlay />
      <InkCursor />
    </>
  );
}
