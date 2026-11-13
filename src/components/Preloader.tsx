import React from 'react';
import { UI_COPY } from '../i18n/translations';
import { Language } from '../types/drink';

interface PreloaderProps {
  brandName: string;
  progress: number;
  accentColor: string;
  visible: boolean;
  lang: Language;
}

export const Preloader: React.FC<PreloaderProps> = ({
  brandName,
  progress,
  accentColor,
  visible,
  lang,
}) => {
  if (!visible) return null;
  const t = UI_COPY[lang].preloader;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${t.loading} ${brandName} ${progress}%`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090B] text-white px-6 transition-opacity duration-500"
    >
      <div className="w-full max-w-xs flex flex-col items-center gap-6">
        <span className="font-display text-4xl sm:text-5xl font-bold tracking-[0.14em] uppercase">
          {brandName}
        </span>

        <div className="w-full h-[2px] bg-white/15 overflow-hidden rounded-full">
          <div
            className="h-full w-full origin-left transition-transform duration-150 ease-out"
            style={{
              backgroundColor: accentColor,
              transform: `scaleX(${Math.max(0.02, progress / 100)})`,
            }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-xs text-zinc-400 font-mono-num">
          <span>{t.preparing}</span>
          <span>
            {t.loading} {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
