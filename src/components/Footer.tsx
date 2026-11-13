import React, { useState } from 'react';
import { Facebook, Instagram, MessageCircle, Twitter, X } from 'lucide-react';
import { buildWhatsAppUrl, normalizeSocialUrl, UI_COPY } from '../i18n/translations';
import { Language, SocialLinks } from '../types/drink';

interface FooterProps {
  brandName: string;
  accentColor: string;
  lang: Language;
  whatsappNumber: string;
  socialLinks: SocialLinks;
}

export const Footer: React.FC<FooterProps> = ({
  brandName,
  accentColor,
  lang,
  whatsappNumber,
  socialLinks,
}) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const t = UI_COPY[lang].footer;

  return (
    <>
      <footer className="bg-black text-white border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <a
            href="#hero"
            className="font-display text-2xl font-bold tracking-[0.12em] uppercase whitespace-nowrap shrink-0"
          >
            {brandName}
          </a>

          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400"
          >
            <a href="#product" className="hover:text-white transition-colors">
              {t.about}
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              {t.contact}
            </a>
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.privacy}
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.terms}
            </button>
          </nav>

          <div className="flex items-center gap-4 text-zinc-400">
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

        <div className="border-t border-white/10">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <span>
              © {new Date().getFullYear()} {t.rights}
            </span>
            <span className="flex items-center gap-2">
              <span>{t.craft}</span>
              <span aria-hidden="true" style={{ color: accentColor }}>
                ·
              </span>
              <span>{t.keepCold}</span>
            </span>
          </div>
        </div>
      </footer>

      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={legalModal === 'privacy' ? t.privacy : t.terms}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-lg rounded-2xl bg-[#121216] text-zinc-100 border border-white/15 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                {legalModal === 'privacy' ? t.privacy : t.terms}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label={t.close}
                className="w-9 h-9 rounded-full border border-white/15 inline-flex items-center justify-center hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">
              {legalModal === 'privacy'
                ? t.privacyText(brandName)
                : t.termsText(brandName)}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="h-10 px-5 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
