import React, { useState } from 'react';
import { Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react';
import { UI_COPY } from '../i18n/translations';
import { Language, ThemeMode } from '../types/drink';

export const NAV_SECTION_IDS = [
  'product',
  'ingredients',
  'nutrition',
  'reviews',
  'faq',
  'contact',
] as const;

interface NavbarProps {
  brandName: string;
  activeSection: string;
  effectiveMode: ThemeMode;
  lang: Language;
  accentColor: string;
  cartCount: number;
  isOverHero: boolean;
  onToggleMode: () => void;
  onToggleLang: () => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  activeSection,
  effectiveMode,
  lang,
  accentColor,
  cartCount,
  isOverHero,
  onToggleMode,
  onToggleLang,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_COPY[lang].nav;

  const navItems = [
    { id: 'product', label: t.product },
    { id: 'ingredients', label: t.ingredients },
    { id: 'nutrition', label: t.nutrition },
    { id: 'reviews', label: t.reviews },
    { id: 'faq', label: t.faq },
    { id: 'contact', label: t.contact },
  ] as const;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headerChrome = isOverHero
    ? 'bg-black/35 backdrop-blur-md border-white/10 text-white'
    : 'bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-md border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white';

  const navbarBrandName =
    brandName.trim().toLowerCase() === 'kossam'
      ? lang === 'fr'
        ? 'Kossam de Ruth'
        : 'Ruth Kossam'
      : brandName;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 ${headerChrome}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#hero"
          onClick={scrollToTop}
          className="font-display text-xl sm:text-2xl font-bold tracking-[0.1em] uppercase whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {navbarBrandName}
        </a>

        {/* Zone 2: Section Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  isActive
                    ? isOverHero
                      ? 'text-white'
                      : 'text-zinc-900 dark:text-white'
                    : isOverHero
                    ? 'text-zinc-300 hover:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[2px] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ backgroundColor: accentColor }}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Language Toggle, Mode Toggle & Bag Action */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={t.switchLangLabel}
            className={`h-10 px-3 inline-flex items-center gap-1 rounded-full border text-xs font-mono-num font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-200 ${
              isOverHero
                ? 'border-white/20 text-white hover:bg-white/10'
                : 'border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10'
            }`}
          >
            <span className={lang === 'en' ? 'opacity-100' : 'opacity-45'}>EN</span>
            <span className="opacity-35">/</span>
            <span className={lang === 'fr' ? 'opacity-100' : 'opacity-45'}>FR</span>
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            aria-label={effectiveMode === 'dark' ? t.switchToLight : t.switchToDark}
            title={effectiveMode === 'dark' ? t.switchToLight : t.switchToDark}
            className={`w-10 h-10 inline-flex items-center justify-center rounded-full border transition-colors duration-200 cursor-pointer shrink-0 ${
              isOverHero
                ? 'border-white/20 text-white hover:bg-white/10'
                : 'border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10'
            }`}
          >
            {effectiveMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`${t.bag} (${cartCount})`}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-full text-xs font-semibold tracking-wide uppercase whitespace-nowrap shrink-0 cursor-pointer transition-transform duration-150 active:scale-95"
            style={{
              backgroundColor: accentColor,
              color: '#09090B',
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.bag}</span>
            <span className="font-mono-num">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={mobileMenuOpen}
            className={`lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-full border cursor-pointer shrink-0 ${
              isOverHero
                ? 'border-white/20 text-white'
                : 'border-zinc-200 dark:border-white/15 text-zinc-800 dark:text-zinc-200'
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-[#09090B] text-zinc-900 dark:text-white px-4 py-4 flex flex-col gap-1"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-white/10 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="w-4 h-0.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
};
