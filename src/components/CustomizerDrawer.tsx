import React from 'react';
import { Plus, RotateCcw, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { UI_COPY } from '../i18n/translations';
import {
  BrandConfig,
  DrinkVariant,
  Language,
  ThemeMode,
  VariantModeOverride,
} from '../types/drink';

interface CustomizerDrawerProps {
  open: boolean;
  brand: BrandConfig;
  variants: DrinkVariant[];
  activeIndex: number;
  effectiveMode: ThemeMode;
  lang: Language;
  onClose: () => void;
  onUpdateBrand: (patch: Partial<BrandConfig>) => void;
  onUpdateVariant: (index: number, patch: Partial<DrinkVariant>) => void;
  onSelectVariant: (index: number) => void;
  onAddVariant: () => void;
  onDeleteVariant: (index: number) => void;
  onResetDefaults: () => void;
}

const ACCENT_PRESETS = ['#E6C280', '#E11D48', '#38BDF8', '#10B981', '#F59E0B', '#FFFFFF'];

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  open,
  brand,
  variants,
  activeIndex,
  effectiveMode,
  lang,
  onClose,
  onUpdateBrand,
  onUpdateVariant,
  onSelectVariant,
  onAddVariant,
  onDeleteVariant,
  onResetDefaults,
}) => {
  if (!open) return null;

  const activeVariant = variants[activeIndex] ?? variants[0];
  const t = UI_COPY[lang].customizer;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs"
    >
      <div className="flex-1" onClick={onClose} aria-hidden="true" />
      <aside className="w-full max-w-lg h-full bg-white dark:bg-[#0D0D10] text-zinc-900 dark:text-zinc-100 border-l border-zinc-200 dark:border-white/10 flex flex-col">
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-4 h-4" />
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">
              {t.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetDefaults}
              title={t.resetAria}
              aria-label={t.resetAria}
              className="w-9 h-9 rounded-full border border-zinc-200 dark:border-white/15 inline-flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeAria}
              className="w-9 h-9 rounded-full border border-zinc-200 dark:border-white/15 inline-flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t.brandSection}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="custom-brand-name"
                  className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                >
                  {t.brandNameLabel}
                </label>
                <input
                  id="custom-brand-name"
                  type="text"
                  value={brand.brandName}
                  onChange={(e) => onUpdateBrand({ brandName: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <span className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
                  {t.globalModeLabel}
                </span>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                  {(['dark', 'light'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => onUpdateBrand({ defaultMode: mode })}
                      className={`h-8 rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                        brand.defaultMode === mode
                          ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                          : 'text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {mode === 'dark' ? t.dark : t.light}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="custom-brand-desc"
                className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
              >
                {t.brandStoryLabel}
              </label>
              <textarea
                id="custom-brand-desc"
                rows={2}
                value={brand.brandDescription}
                onChange={(e) => onUpdateBrand({ brandDescription: e.target.value })}
                className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 text-sm resize-none focus:outline-none focus:border-zinc-900 dark:focus:border-white"
              />
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t.contactSocialSection}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="custom-whatsapp"
                  className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                >
                  {t.whatsappLabel}
                </label>
                <input
                  id="custom-whatsapp"
                  type="text"
                  value={brand.whatsappNumber}
                  onChange={(e) => onUpdateBrand({ whatsappNumber: e.target.value })}
                  placeholder="+237 6 81 31 62 46"
                  className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 font-mono-num text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-facebook"
                  className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                >
                  {t.facebookLabel}
                </label>
                <input
                  id="custom-facebook"
                  type="url"
                  value={brand.socialLinks.facebook}
                  onChange={(e) =>
                    onUpdateBrand({
                      socialLinks: { ...brand.socialLinks, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/yourpage"
                  className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-instagram"
                  className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                >
                  {t.instagramLabel}
                </label>
                <input
                  id="custom-instagram"
                  type="url"
                  value={brand.socialLinks.instagram}
                  onChange={(e) =>
                    onUpdateBrand({
                      socialLinks: { ...brand.socialLinks, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-twitter"
                  className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                >
                  {t.twitterLabel}
                </label>
                <input
                  id="custom-twitter"
                  type="url"
                  value={brand.socialLinks.twitter}
                  onChange={(e) =>
                    onUpdateBrand({
                      socialLinks: { ...brand.socialLinks, twitter: e.target.value },
                    })
                  }
                  placeholder="https://x.com/yourhandle"
                  className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-white/10">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t.activeVariantLabel} ({String(activeIndex + 1).padStart(2, '0')})
              </h3>
              <button
                type="button"
                onClick={onAddVariant}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addVariant}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {variants.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onSelectVariant(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                    idx === activeIndex
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent'
                      : 'border-zinc-200 dark:border-white/15 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')} · {v.name}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="var-name"
                    className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                  >
                    {t.flavorName}
                  </label>
                  <input
                    id="var-name"
                    type="text"
                    value={activeVariant.name}
                    onChange={(e) => onUpdateVariant(activeIndex, { name: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="var-subtitle"
                    className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                  >
                    {t.subtitle}
                  </label>
                  <input
                    id="var-subtitle"
                    type="text"
                    value={activeVariant.subtitle}
                    onChange={(e) => onUpdateVariant(activeIndex, { subtitle: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="var-desc"
                  className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                >
                  {t.heroDescription}
                </label>
                <textarea
                  id="var-desc"
                  rows={3}
                  value={activeVariant.description}
                  onChange={(e) => onUpdateVariant(activeIndex, { description: e.target.value })}
                  className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 text-sm resize-none focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="var-color"
                    className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                  >
                    {t.themeColor}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="var-color"
                      type="color"
                      value={activeVariant.themeColor}
                      onChange={(e) => onUpdateVariant(activeIndex, { themeColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-zinc-300 dark:border-white/15 bg-transparent cursor-pointer shrink-0"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {ACCENT_PRESETS.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => onUpdateVariant(activeIndex, { themeColor: hex })}
                          aria-label={`Set theme color ${hex}`}
                          className="w-6 h-6 rounded-full border border-zinc-400/40 cursor-pointer"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="var-mode-override"
                    className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                  >
                    {t.modeOverride} ({t.activeLabel}: {effectiveMode === 'dark' ? t.dark : t.light})
                  </label>
                  <select
                    id="var-mode-override"
                    value={activeVariant.modeOverride}
                    onChange={(e) =>
                      onUpdateVariant(activeIndex, {
                        modeOverride: e.target.value as VariantModeOverride,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  >
                    <option value="inherit">{t.inheritGlobal}</option>
                    <option value="dark">{t.forceDark}</option>
                    <option value="light">{t.forceLight}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
                <div className="sm:col-span-9">
                  <label
                    htmlFor="var-seq-url"
                    className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                  >
                    {t.sequenceUrl}
                  </label>
                  <input
                    id="var-seq-url"
                    type="text"
                    value={activeVariant.sequencePattern}
                    onChange={(e) =>
                      onUpdateVariant(activeIndex, { sequencePattern: e.target.value })
                    }
                    placeholder="/sequences/vanille/frame_{0001}.webp"
                    className="w-full h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 font-mono-num text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="var-frame-count"
                    className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300"
                  >
                    {t.frames}
                  </label>
                  <input
                    id="var-frame-count"
                    type="number"
                    min={1}
                    max={480}
                    value={activeVariant.frameCount}
                    onChange={(e) =>
                      onUpdateVariant(activeIndex, {
                        frameCount: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-[#141418] border border-zinc-300 dark:border-white/15 font-mono-num text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                  />
                </div>
              </div>

              {variants.length > 1 && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onDeleteVariant(activeIndex)}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.removeVariant}</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{t.savedNote}</span>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            {t.done}
          </button>
        </div>
      </aside>
    </div>
  );
};
