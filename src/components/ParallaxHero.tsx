import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Instagram,
  Facebook,
  MessageCircle,
  Twitter,
  SlidersHorizontal,
} from 'lucide-react';
import { buildWhatsAppUrl, UI_COPY, normalizeSocialUrl } from '../i18n/translations';
import { DrinkVariant, Language, SocialLinks } from '../types/drink';

interface ParallaxHeroProps {
  brandName: string;
  variant: DrinkVariant;
  variantIndex: number;
  totalVariants: number;
  frames: HTMLImageElement[];
  isVariantLoading: boolean;
  variantLoadProgress: number;
  lang: Language;
  whatsappNumber: string;
  socialLinks: SocialLinks;
  onPrevVariant: () => void;
  onNextVariant: () => void;
  onAddToCart: (variantId: string) => void;
  onOpenCustomizer: () => void;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  brandName,
  variant,
  variantIndex,
  totalVariants,
  frames,
  isVariantLoading,
  variantLoadProgress,
  lang,
  whatsappNumber,
  socialLinks,
  onPrevVariant,
  onNextVariant,
  onAddToCart,
  onOpenCustomizer,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentFrameFloatRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const t = UI_COPY[lang].hero;

  // Fade-out -> fade-in transition state on variant switch
  const [displayedVariant, setDisplayedVariant] = useState<DrinkVariant>(variant);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    if (
      displayedVariant.id === variant.id &&
      displayedVariant.name === variant.name &&
      displayedVariant.subtitle === variant.subtitle &&
      displayedVariant.description === variant.description &&
      displayedVariant.abvOrStyle === variant.abvOrStyle &&
      displayedVariant.themeColor === variant.themeColor
    ) {
      return;
    }

    if (displayedVariant.id !== variant.id) {
      setTextVisible(false);
      const timer = window.setTimeout(() => {
        setDisplayedVariant(variant);
        setTextVisible(true);
      }, 170);
      return () => window.clearTimeout(timer);
    } else {
      setDisplayedVariant(variant);
    }
  }, [variant, displayedVariant]);

  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clamped = Math.max(0, Math.min(frames.length - 1, Math.round(frameIdx)));
    const img = frames[clamped];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    const targetW = Math.round(width * dpr);
    const targetH = Math.round(height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawW: number;
    let drawH: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasRatio > imgRatio) {
      drawW = width;
      drawH = width / imgRatio;
      offsetX = 0;
      offsetY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgRatio;
      offsetX = (width - drawW) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateTargetFromScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollableDistance = Math.max(1, track.offsetHeight - window.innerHeight);
      const rawProgress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
      setScrollProgress(rawProgress);

      const maxFrame = Math.max(0, frames.length - 1);
      targetFrameRef.current = prefersReducedMotion ? 0 : rawProgress * maxFrame;
    };

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameFloatRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameFloatRef.current += diff * 0.22;
      } else {
        currentFrameFloatRef.current = targetFrameRef.current;
      }
      drawFrame(currentFrameFloatRef.current);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    updateTargetFromScroll();
    drawFrame(currentFrameFloatRef.current);

    window.addEventListener('scroll', updateTargetFromScroll, { passive: true });
    window.addEventListener('resize', updateTargetFromScroll, { passive: true });
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', updateTargetFromScroll);
      window.removeEventListener('resize', updateTargetFromScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [frames]);

  const formattedIndex = String(variantIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalVariants).padStart(2, '0');

  return (
    <section
      id="hero"
      ref={trackRef}
      aria-label="Hero showcase"
      className="relative h-[300vh] w-full bg-[#050507]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050507] text-white">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full block"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/45"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent"
        />

        <div className="relative z-10 max-w-[1440px] mx-auto h-full px-5 sm:px-8 lg:px-12 pt-20 pb-8 flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-between gap-6">
            {/* Left Side: Overlay Text Block */}
            <div
              className={`max-w-md transition-all duration-200 ease-out ${
                textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="mb-3 flex items-center gap-3 text-xs tracking-[0.22em] uppercase text-zinc-300">
                <span>{brandName}</span>
                <span aria-hidden="true">·</span>
                <span style={{ color: displayedVariant.themeColor }}>
                  {displayedVariant.abvOrStyle}
                </span>
              </div>

              <h1
                className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.94] text-white"
                style={{ textWrap: 'balance' }}
              >
                {displayedVariant.name}
              </h1>

              <p className="mt-2 text-lg sm:text-2xl font-light tracking-wide text-zinc-200">
                {displayedVariant.subtitle}
              </p>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300 max-w-sm">
                {displayedVariant.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onAddToCart(variant.id)}
                  className="h-11 px-7 rounded-full border border-white/60 bg-transparent text-white text-xs sm:text-sm font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 hover:bg-white/10 active:scale-95"
                >
                  {t.addToCart}
                </button>

                <button
                  type="button"
                  onClick={onOpenCustomizer}
                  className="h-11 px-7 rounded-full bg-white text-black text-xs sm:text-sm font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-2 transition-all duration-150 hover:bg-zinc-200 active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{t.customize}</span>
                </button>
              </div>
            </div>

            <div className="hidden md:block flex-1" aria-hidden="true" />

            {/* Right Side Variant Navigation */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <div className="flex flex-col items-end">
                <span
                  className="font-display font-mono-num text-6xl sm:text-7xl lg:text-[6.25rem] font-bold leading-none tracking-tight select-none"
                  style={{ color: variant.themeColor }}
                >
                  {formattedIndex}
                </span>
                <span className="mt-1 text-[11px] font-mono-num tracking-widest text-zinc-400">
                  {formattedIndex} / {formattedTotal}
                </span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={onPrevVariant}
                  aria-label={t.prevAria}
                  className="group flex flex-col items-center gap-1.5 py-2 px-2 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                >
                  <ArrowUp className="w-4 h-4 transition-transform duration-150 group-hover:-translate-y-0.5" />
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
                    {t.prev}
                  </span>
                </button>

                <div className="w-px h-10 bg-white/25" aria-hidden="true" />

                <button
                  type="button"
                  onClick={onNextVariant}
                  aria-label={t.nextAria}
                  className="group flex flex-col items-center gap-1.5 py-2 px-2 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                >
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
                    {t.next}
                  </span>
                  <ArrowDown className="w-4 h-4 transition-transform duration-150 group-hover:translate-y-0.5" />
                </button>

                {isVariantLoading && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-1 text-[10px] font-mono-num text-zinc-300 whitespace-nowrap"
                  >
                    {variantLoadProgress}%
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center pt-4">
            <div className="hidden sm:flex items-center gap-3 absolute left-0 bottom-0 text-[11px] font-mono-num tracking-wider text-zinc-400">
              <span>{t.scroll}</span>
              <span className="w-14 h-[2px] bg-white/20 overflow-hidden rounded-full block">
                <span
                  className="block h-full w-full origin-left"
                  style={{
                    backgroundColor: variant.themeColor,
                    transform: `scaleX(${Math.max(0.05, scrollProgress)})`,
                  }}
                />
              </span>
              <span>{Math.round(scrollProgress * 100)}%</span>
            </div>

            <div className="flex items-center gap-5 text-zinc-300" aria-label="Social links">
              <a
                href={buildWhatsAppUrl(whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${brandName} WhatsApp (${whatsappNumber})`}
                className="p-2 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={normalizeSocialUrl(socialLinks.twitter, 'https://x.com')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${brandName} on X (Twitter)`}
                className="p-2 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={normalizeSocialUrl(socialLinks.instagram, 'https://instagram.com')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${brandName} on Instagram`}
                className="p-2 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={normalizeSocialUrl(socialLinks.facebook, 'https://facebook.com')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${brandName} on Facebook`}
                className="p-2 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
