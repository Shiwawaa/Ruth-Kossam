import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CustomizerDrawer } from './components/CustomizerDrawer';
import { Footer } from './components/Footer';
import { NAV_SECTION_IDS, Navbar } from './components/Navbar';
import { ParallaxHero } from './components/ParallaxHero';
import { Preloader } from './components/Preloader';
import { ProductSections } from './components/ProductSections';
import {
  DEFAULT_BRAND_CONFIG,
  DEFAULT_VARIANTS,
} from './data/defaultVariants';
import { useWebpSequence } from './hooks/useWebpSequence';
import { localizeBrandDescription, localizeVariant } from './i18n/translations';
import {
  BrandConfig,
  CartItem,
  DrinkVariant,
  Language,
  ThemeMode,
} from './types/drink';

const STORAGE_KEY_BRAND = 'kossam_brand_config_v2';
const STORAGE_KEY_VARIANTS = 'kossam_variants_v3';
const STORAGE_KEY_LANG = 'kossam_lang_v1';

function loadStoredBrand(): BrandConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BRAND);
    if (!raw) return DEFAULT_BRAND_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_BRAND_CONFIG,
      ...parsed,
      socialLinks: {
        ...DEFAULT_BRAND_CONFIG.socialLinks,
        ...(parsed?.socialLinks ?? {}),
      },
    };
  } catch {
    return DEFAULT_BRAND_CONFIG;
  }
}

function loadStoredVariants(): DrinkVariant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VARIANTS);
    if (!raw) return DEFAULT_VARIANTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_VARIANTS;
  } catch {
    return DEFAULT_VARIANTS;
  }
}

function loadStoredLang(): Language {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LANG);
    return raw === 'fr' ? 'fr' : 'en';
  } catch {
    return 'en';
  }
}

export default function App() {
  const [brand, setBrand] = useState<BrandConfig>(loadStoredBrand);
  const [variants, setVariants] = useState<DrinkVariant[]>(loadStoredVariants);
  const [lang, setLang] = useState<Language>(loadStoredLang);
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const [activeSection, setActiveSection] = useState('product');
  const [isOverHero, setIsOverHero] = useState(true);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const safeIndex = Math.min(activeIndex, Math.max(0, variants.length - 1));
  const rawActiveVariant = variants[safeIndex] ?? DEFAULT_VARIANTS[0];

  const localizedVariants = useMemo(
    () => variants.map((v) => localizeVariant(v, lang)),
    [variants, lang],
  );
  const activeVariant = localizedVariants[safeIndex] ?? localizeVariant(DEFAULT_VARIANTS[0], lang);

  const localizedBrand = useMemo(
    () => ({
      ...brand,
      brandDescription: localizeBrandDescription(brand.brandDescription, lang),
    }),
    [brand, lang],
  );

  // Preload active variant's WebP sequence
  const sequence = useWebpSequence(
    rawActiveVariant.sequencePattern,
    rawActiveVariant.frameCount,
  );

  // Unlock hero only after initial sequence finishes loading
  useEffect(() => {
    if (!initialLoaded && sequence.isLoaded) {
      const timer = window.setTimeout(() => setInitialLoaded(true), 220);
      return () => window.clearTimeout(timer);
    }
  }, [initialLoaded, sequence.isLoaded]);

  // Effective dark/light mode (supports per-variant override + global toggle)
  const effectiveMode: ThemeMode = useMemo(() => {
    if (rawActiveVariant.modeOverride !== 'inherit') {
      return rawActiveVariant.modeOverride;
    }
    return brand.defaultMode;
  }, [rawActiveVariant.modeOverride, brand.defaultMode]);

  // Sync <html> .dark class, lang attribute & --brand-accent variable
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', effectiveMode === 'dark');
    root.lang = lang;
    root.style.setProperty('--brand-accent', rawActiveVariant.themeColor);
  }, [effectiveMode, lang, rawActiveVariant.themeColor]);

  // Persist customizations locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BRAND, JSON.stringify(brand));
    } catch {
      // Ignore storage quota errors
    }
  }, [brand]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VARIANTS, JSON.stringify(variants));
    } catch {
      // Ignore storage quota errors
    }
  }, [variants]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // Ignore storage errors
    }
  }, [lang]);

  // Scroll-spy for sticky navigation active indicator + hero header transparency
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        setIsOverHero(rect.bottom > 80);
      }

      const scrollOffset = window.scrollY + 140;
      let current: string = NAV_SECTION_IDS[0];
      for (const secId of NAV_SECTION_IDS) {
        const el = document.getElementById(secId);
        if (el && el.offsetTop <= scrollOffset) {
          current = secId;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMode = () => {
    const nextMode: ThemeMode = effectiveMode === 'dark' ? 'light' : 'dark';
    setBrand((prev) => ({ ...prev, defaultMode: nextMode }));
    if (rawActiveVariant.modeOverride !== 'inherit') {
      setVariants((prev) =>
        prev.map((v, idx) =>
          idx === safeIndex ? { ...v, modeOverride: 'inherit' } : v,
        ),
      );
    }
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  const handlePrevVariant = () => {
    setActiveIndex((prev) => (prev - 1 + variants.length) % variants.length);
  };

  const handleNextVariant = () => {
    setActiveIndex((prev) => (prev + 1) % variants.length);
  };

  const handleAddToCart = (variantId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variantId === variantId);
      if (existing) {
        return prev.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { variantId, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (variantId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveCartItem = (variantId: string) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateBrand = (patch: Partial<BrandConfig>) => {
    setBrand((prev) => ({ ...prev, ...patch }));
  };

  const handleUpdateVariant = (index: number, patch: Partial<DrinkVariant>) => {
    setVariants((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)),
    );
  };

  const handleAddVariant = () => {
    const base = rawActiveVariant;
    const nextNum = variants.length + 1;
    const created: DrinkVariant = {
      ...base,
      id: `custom-${Date.now()}`,
      name: `EDITION ${nextNum}`,
      subtitle: lang === 'fr' ? 'Mélange sur mesure' : 'Custom Blend',
      description:
        lang === 'fr'
          ? 'Une infusion lactée artisanale créée pour votre menu.'
          : 'A custom small-batch yogurt infusion crafted for your personal menu.',
      themeColor: '#38BDF8',
      modeOverride: 'inherit',
    };
    setVariants((prev) => [...prev, created]);
    setActiveIndex(variants.length);
  };

  const handleDeleteVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
    setActiveIndex((prev) => Math.max(0, Math.min(prev, variants.length - 2)));
  };

  const handleResetDefaults = () => {
    setBrand(DEFAULT_BRAND_CONFIG);
    setVariants(DEFAULT_VARIANTS);
    setActiveIndex(0);
    localStorage.removeItem(STORAGE_KEY_BRAND);
    localStorage.removeItem(STORAGE_KEY_VARIANTS);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#09090B] dark:text-zinc-100">
      <Preloader
        brandName={localizedBrand.brandName}
        progress={sequence.progress}
        accentColor={activeVariant.themeColor}
        visible={!initialLoaded}
        lang={lang}
      />

      <Navbar
        brandName={localizedBrand.brandName}
        activeSection={activeSection}
        effectiveMode={effectiveMode}
        lang={lang}
        accentColor={activeVariant.themeColor}
        cartCount={totalCartCount}
        isOverHero={isOverHero}
        onToggleMode={handleToggleMode}
        onToggleLang={handleToggleLang}
        onOpenCart={() => setCartOpen(true)}
      />

      <main>
        <ParallaxHero
          brandName={localizedBrand.brandName}
          variant={activeVariant}
          variantIndex={safeIndex}
          totalVariants={localizedVariants.length}
          frames={sequence.frames}
          isVariantLoading={initialLoaded && sequence.isLoading}
          variantLoadProgress={sequence.progress}
          lang={lang}
          whatsappNumber={brand.whatsappNumber}
          socialLinks={brand.socialLinks}
          onPrevVariant={handlePrevVariant}
          onNextVariant={handleNextVariant}
          onAddToCart={handleAddToCart}
          onOpenCustomizer={() => setCustomizerOpen(true)}
        />

        <ProductSections
          brand={localizedBrand}
          variants={localizedVariants}
          activeVariant={activeVariant}
          activeIndex={safeIndex}
          lang={lang}
          onSelectVariant={setActiveIndex}
          onAddToCart={handleAddToCart}
          onOpenCustomizer={() => setCustomizerOpen(true)}
        />
      </main>

      <Footer
        brandName={localizedBrand.brandName}
        accentColor={activeVariant.themeColor}
        lang={lang}
        whatsappNumber={brand.whatsappNumber}
        socialLinks={brand.socialLinks}
      />

      <CartDrawer
        open={cartOpen}
        brandName={localizedBrand.brandName}
        accentColor={activeVariant.themeColor}
        lang={lang}
        whatsappNumber={brand.whatsappNumber}
        items={cartItems}
        variants={localizedVariants}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <CustomizerDrawer
        open={customizerOpen}
        brand={brand}
        variants={variants}
        activeIndex={safeIndex}
        effectiveMode={effectiveMode}
        lang={lang}
        onClose={() => setCustomizerOpen(false)}
        onUpdateBrand={handleUpdateBrand}
        onUpdateVariant={handleUpdateVariant}
        onSelectVariant={setActiveIndex}
        onAddVariant={handleAddVariant}
        onDeleteVariant={handleDeleteVariant}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
