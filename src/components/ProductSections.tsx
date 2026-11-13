import React, { useState } from 'react';
import { Check, MessageCircle, Minus, Plus, SlidersHorizontal, Star } from 'lucide-react';
import { BrandConfig, DrinkVariant, Language } from '../types/drink';
import { CTA_SQUARE_IMAGE } from '../data/defaultVariants';
import { buildWhatsAppUrl, formatFrs, UI_COPY } from '../i18n/translations';

interface ProductSectionsProps {
  brand: BrandConfig;
  variants: DrinkVariant[];
  activeVariant: DrinkVariant;
  activeIndex: number;
  lang: Language;
  onSelectVariant: (index: number) => void;
  onAddToCart: (variantId: string) => void;
  onOpenCustomizer: () => void;
}

export const ProductSections: React.FC<ProductSectionsProps> = ({
  brand,
  variants,
  activeVariant,
  activeIndex,
  lang,
  onSelectVariant,
  onAddToCart,
  onOpenCustomizer,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  const t = UI_COPY[lang].sections;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContact = contactEmail.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
    const phoneValid = /^\+?[0-9\s()-]{7,}$/.test(trimmedContact);
    if (!contactName.trim() || (!emailValid && !phoneValid) || contactMessage.trim().length < 4) {
      setContactError(t.contactError);
      return;
    }
    const header =
      lang === 'fr'
        ? `Bonjour ${brand.brandName}, nouveau message client :`
        : `Hello ${brand.brandName}, new customer message:`;
    const body = `${header}\nName: ${contactName.trim()}\nContact: ${trimmedContact}\nFlavor: ${activeVariant.name}\nMessage: ${contactMessage.trim()}`;
    const waUrl = buildWhatsAppUrl(brand.whatsappNumber, body);

    setContactError('');
    setLastWhatsAppUrl(waUrl);
    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');

    const anchor = document.createElement('a');
    anchor.href = waUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const formattedPackPrice = formatFrs(activeVariant.pricePerPack, lang);

  return (
    <div className="bg-zinc-50 text-zinc-900 dark:bg-[#09090B] dark:text-zinc-100 transition-colors duration-300">
      {/* 1. Product / About Section */}
      <section
        id="product"
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28 border-b border-zinc-200 dark:border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 min-h-[340px]">
            <img
              src={activeVariant.studioImage}
              alt={`${brand.brandName} ${activeVariant.name}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover block"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex items-center justify-between gap-4">
              <div className="text-xs tracking-wider uppercase text-zinc-200">
                <span>{activeVariant.name}</span>
                <span aria-hidden="true"> · </span>
                <span>{activeVariant.abvOrStyle}</span>
              </div>
              <span className="font-mono-num text-sm font-semibold">
                {formattedPackPrice}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between gap-8 py-2">
            <div>
              <p
                className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
                style={{ color: activeVariant.themeColor }}
              >
                {t.aboutPrefix} {brand.brandName}
              </p>

              <h2
                className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight leading-[1.02] text-zinc-900 dark:text-white"
                style={{ textWrap: 'balance' }}
              >
                {activeVariant.storyHeadline}
              </h2>

              <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-xl">
                {brand.brandDescription} {activeVariant.storyBody}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <span className="uppercase tracking-wider text-zinc-900 dark:text-zinc-200 font-semibold">
                  {t.notes}
                </span>
                <span aria-hidden="true">/</span>
                {activeVariant.tastingNotes.map((note, idx) => (
                  <React.Fragment key={note}>
                    <span>{note}</span>
                    {idx < activeVariant.tastingNotes.length - 1 && (
                      <span aria-hidden="true">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-white/10 flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div
                  role="tablist"
                  aria-label="Select drink flavor"
                  className="inline-flex items-center gap-1 p-1 rounded-lg bg-zinc-200/80 dark:bg-white/5 border border-zinc-300/60 dark:border-white/10"
                >
                  {variants.map((item, idx) => {
                    const selected = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={selected}
                        type="button"
                        onClick={() => onSelectVariant(idx)}
                        className={`px-3.5 py-2 text-xs font-semibold tracking-wider uppercase rounded-md whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                          selected
                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')} · {item.name}
                      </button>
                    );
                  })}
                </div>

                <span className="font-mono-num text-lg font-semibold text-zinc-900 dark:text-white">
                  {formattedPackPrice}{' '}
                  <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                    / {activeVariant.packSize}-{t.packUnit}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onAddToCart(activeVariant.id)}
                  className="h-11 px-6 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 cursor-pointer transition-transform duration-150 active:scale-95"
                  style={{
                    backgroundColor: activeVariant.themeColor,
                    color: '#09090B',
                  }}
                >
                  {t.addPack} {activeVariant.name} · {t.packSuffix}
                </button>
                <button
                  type="button"
                  onClick={onOpenCustomizer}
                  className="h-11 px-5 rounded-full border border-zinc-300 dark:border-white/20 text-xs font-semibold tracking-wider uppercase text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-2 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{t.editSpecs}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ingredients & Benefits Section */}
      <section
        id="ingredients"
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28 border-b border-zinc-200 dark:border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-4">
            <p
              className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
              style={{ color: activeVariant.themeColor }}
            >
              {t.ingredientsKicker}
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight leading-tight text-zinc-900 dark:text-white"
              style={{ textWrap: 'balance' }}
            >
              {t.ingredientsTitle}
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t.ingredientsSub(brand.brandName, activeVariant.name.toLowerCase())}
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-zinc-200 dark:divide-white/10 border-t border-b border-zinc-200 dark:border-white/10">
            {activeVariant.ingredients.map((ing, idx) => (
              <div
                key={ing.name}
                className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
              >
                <div className="sm:col-span-1 font-mono-num text-xs text-zinc-400">
                  {String(idx + 1).padStart(2, '0')}.
                </div>
                <div className="sm:col-span-4">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                    {ing.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{ing.origin}</p>
                </div>
                <p className="sm:col-span-7 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {ing.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Nutrition Facts Section */}
      <section
        id="nutrition"
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28 border-b border-zinc-200 dark:border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div>
              <p
                className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
                style={{ color: activeVariant.themeColor }}
              >
                {t.nutritionKicker} · {activeVariant.name}
              </p>
              <h2
                className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight leading-tight text-zinc-900 dark:text-white"
                style={{ textWrap: 'balance' }}
              >
                {t.nutritionTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-lg">
                {t.nutritionSub}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-200 dark:border-white/10">
              <div>
                <div className="font-display font-mono-num text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                  {activeVariant.nutrition.protein}
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {t.completeProtein}
                </div>
              </div>
              <div>
                <div className="font-display font-mono-num text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                  12B
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {t.liveProbiotic}
                </div>
              </div>
              <div>
                <div className="font-display font-mono-num text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                  {activeVariant.nutrition.dietaryFiber}
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {t.prebioticFiber}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex lg:justify-end">
            <div className="w-full max-w-md bg-white dark:bg-[#121216] text-zinc-900 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-200 rounded-xl p-6 font-sans-body">
              <div className="border-b-[6px] border-zinc-900 dark:border-zinc-100 pb-2">
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight">
                  {t.nutritionFacts}
                </h3>
                <div className="mt-1 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                  <span>{t.servingPerBottle(activeVariant.nutrition.servingsPerBottle)}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {t.servingSize} {activeVariant.nutrition.servingSize}
                  </span>
                </div>
              </div>

              <div className="py-3 border-b-[4px] border-zinc-900 dark:border-zinc-100 flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {t.amountPerServing}
                  </div>
                  <div className="text-xl font-bold">{t.calories}</div>
                </div>
                <div className="font-mono-num text-4xl font-bold">
                  {activeVariant.nutrition.calories}
                </div>
              </div>

              <div className="py-1.5 text-right text-[11px] font-bold border-b border-zinc-300 dark:border-zinc-700">
                {t.dailyValue}
              </div>

              <dl className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                <div className="py-2 flex justify-between">
                  <dt>
                    <span className="font-bold">{t.totalFat}</span> {activeVariant.nutrition.totalFat}
                  </dt>
                  <dd className="font-mono-num font-bold">{activeVariant.nutrition.totalFatDv}</dd>
                </div>
                <div className="py-2 pl-4 flex justify-between text-zinc-700 dark:text-zinc-300">
                  <dt>
                    {t.saturatedFat} {activeVariant.nutrition.saturatedFat}
                  </dt>
                  <dd className="font-mono-num font-bold">
                    {activeVariant.nutrition.saturatedFatDv}
                  </dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt>
                    <span className="font-bold">{t.cholesterol}</span>{' '}
                    {activeVariant.nutrition.cholesterol}
                  </dt>
                  <dd className="font-mono-num font-bold">
                    {activeVariant.nutrition.cholesterolDv}
                  </dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt>
                    <span className="font-bold">{t.sodium}</span> {activeVariant.nutrition.sodium}
                  </dt>
                  <dd className="font-mono-num font-bold">{activeVariant.nutrition.sodiumDv}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt>
                    <span className="font-bold">{t.totalCarb}</span>{' '}
                    {activeVariant.nutrition.totalCarbs}
                  </dt>
                  <dd className="font-mono-num font-bold">
                    {activeVariant.nutrition.totalCarbsDv}
                  </dd>
                </div>
                <div className="py-2 pl-4 flex justify-between text-zinc-700 dark:text-zinc-300">
                  <dt>
                    {t.dietaryFiber} {activeVariant.nutrition.dietaryFiber}
                  </dt>
                  <dd className="font-mono-num font-bold">
                    {activeVariant.nutrition.dietaryFiberDv}
                  </dd>
                </div>
                <div className="py-2 pl-4 flex justify-between text-zinc-700 dark:text-zinc-300">
                  <dt>
                    {t.totalSugars} {activeVariant.nutrition.totalSugars}
                  </dt>
                  <dd className="text-xs text-zinc-500">
                    {t.inclAdded(activeVariant.nutrition.addedSugars)}
                  </dd>
                </div>
                <div className="py-2 flex justify-between border-b-[4px] border-zinc-900 dark:border-zinc-100">
                  <dt>
                    <span className="font-bold">{t.protein}</span> {activeVariant.nutrition.protein}
                  </dt>
                  <dd className="font-mono-num font-bold">{activeVariant.nutrition.proteinDv}</dd>
                </div>
                <div className="py-2 flex justify-between text-xs">
                  <dt>
                    {t.calcium} {activeVariant.nutrition.calcium}
                  </dt>
                  <dd className="font-mono-num">{activeVariant.nutrition.calciumDv}</dd>
                </div>
                <div className="py-2 flex justify-between text-xs">
                  <dt>
                    {t.potassium} {activeVariant.nutrition.potassium}
                  </dt>
                  <dd className="font-mono-num">{activeVariant.nutrition.potassiumDv}</dd>
                </div>
                <div className="pt-3 flex justify-between text-xs font-semibold">
                  <dt>{t.liveActiveCultures}</dt>
                  <dd className="font-mono-num" style={{ color: activeVariant.themeColor }}>
                    {activeVariant.nutrition.liveCultures}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Reviews / Social Proof Section */}
      <section
        id="reviews"
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28 border-b border-zinc-200 dark:border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p
              className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
              style={{ color: activeVariant.themeColor }}
            >
              {t.reviewsKicker}
            </p>
            <h2
              className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white"
              style={{ textWrap: 'balance' }}
            >
              {t.reviewsTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 font-mono-num">
            <div className="flex items-center gap-0.5" style={{ color: activeVariant.themeColor }}>
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white">4.9 / 5.0</span>
            <span className="text-zinc-400">·</span>
            <span>{t.deliveriesCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.reviews.map((review) => (
            <article
              key={review.id}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-white/10 flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                  <span>{review.flavor}</span>
                  <span className="font-mono-num">{review.rating}.0 ★</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-200">
                  “{review.quote}”
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/10">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {review.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{review.role}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. FAQ Accordion Section */}
      <section
        id="faq"
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28 border-b border-zinc-200 dark:border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p
              className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
              style={{ color: activeVariant.themeColor }}
            >
              {t.faqKicker}
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white"
              style={{ textWrap: 'balance' }}
            >
              {t.faqTitle}
            </h2>
          </div>

          <div className="lg:col-span-8 divide-y divide-zinc-200 dark:divide-white/10 border-t border-b border-zinc-200 dark:border-white/10">
            {t.faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                  >
                    <span className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white group-hover:opacity-80 transition-opacity">
                      {item.q}
                    </span>
                    <span className="w-8 h-8 rounded-full border border-zinc-200 dark:border-white/15 inline-flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-300">
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-6 pr-10 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Final Call-to-Action & Contact Section */}
      <section
        id="contact"
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-5 flex items-center">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-rose-950 border border-zinc-200 dark:border-white/10 relative">
              <img
                src={CTA_SQUARE_IMAGE}
                alt={`${brand.brandName} Fraise bottle surrounded by fresh strawberries`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div>
              <p
                className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
                style={{ color: activeVariant.themeColor }}
              >
                {t.ctaKicker}
              </p>
              <h2
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.98] text-zinc-900 dark:text-white"
                style={{ textWrap: 'balance' }}
              >
                {t.ctaTitle(brand.brandName)}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-xl">
                {t.ctaSub}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onAddToCart(activeVariant.id)}
                  className="h-11 px-7 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 cursor-pointer transition-transform duration-150 active:scale-95"
                  style={{
                    backgroundColor: activeVariant.themeColor,
                    color: '#09090B',
                  }}
                >
                  {t.orderBtn(activeVariant.name, formattedPackPrice)}
                </button>
                <button
                  type="button"
                  onClick={onOpenCustomizer}
                  className="h-11 px-6 rounded-full border border-zinc-300 dark:border-white/20 text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                >
                  {t.customizeLineup}
                </button>
              </div>
            </div>

            <form
              onSubmit={handleContactSubmit}
              noValidate
              className="pt-8 border-t border-zinc-200 dark:border-white/10 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
                  {t.sendMessage}
                </h3>
                <a
                  href={buildWhatsAppUrl(brand.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono-num text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" style={{ color: activeVariant.themeColor }} />
                  <span>{brand.whatsappNumber}</span>
                </a>
              </div>

              {contactSubmitted ? (
                <div
                  role="status"
                  className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{t.contactSuccess}</span>
                  </div>
                  {lastWhatsAppUrl && (
                    <a
                      href={lastWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-4 rounded-full bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{t.openWhatsApp}</span>
                    </a>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="sr-only">
                        {t.namePlaceholder}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder={t.namePlaceholder}
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-white dark:bg-[#121216] border border-zinc-300 dark:border-white/15 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="sr-only">
                        {t.emailPlaceholder}
                      </label>
                      <input
                        id="contact-email"
                        type="text"
                        placeholder={t.emailPlaceholder}
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-white dark:bg-[#121216] border border-zinc-300 dark:border-white/15 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-msg" className="sr-only">
                      {t.msgPlaceholder}
                    </label>
                    <textarea
                      id="contact-msg"
                      rows={3}
                      placeholder={t.msgPlaceholder}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full p-4 rounded-xl bg-white dark:bg-[#121216] border border-zinc-300 dark:border-white/15 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-white resize-none"
                    />
                  </div>
                  {contactError && (
                    <p role="alert" className="text-xs text-rose-500">
                      {contactError}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="h-11 px-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.sendInquiry}</span>
                    </button>
                    <a
                      href={buildWhatsAppUrl(brand.whatsappNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 px-5 rounded-full border border-zinc-300 dark:border-white/20 text-xs font-semibold tracking-wider uppercase text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 inline-flex items-center gap-2 transition-colors"
                    >
                      <span>{t.directWhatsApp}</span>
                    </a>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
