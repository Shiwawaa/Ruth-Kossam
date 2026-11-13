import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { buildWhatsAppUrl, formatFrs, UI_COPY } from '../i18n/translations';
import { CartItem, DrinkVariant, Language } from '../types/drink';

interface CartDrawerProps {
  open: boolean;
  brandName: string;
  accentColor: string;
  lang: Language;
  whatsappNumber: string;
  items: CartItem[];
  variants: DrinkVariant[];
  onClose: () => void;
  onUpdateQuantity: (variantId: string, delta: number) => void;
  onRemoveItem: (variantId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  brandName,
  accentColor,
  lang,
  whatsappNumber,
  items,
  variants,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [lastOrderUrl, setLastOrderUrl] = useState('');

  if (!open) return null;

  const t = UI_COPY[lang].cart;

  const lineItems = items
    .map((item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) return null;
      return { ...item, variant };
    })
    .filter((x): x is { variantId: string; quantity: number; variant: DrinkVariant } => x !== null);

  const subtotal = lineItems.reduce(
    (sum, line) => sum + line.quantity * line.variant.pricePerPack,
    0,
  );
  const freeShippingThreshold = 12000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    const summaryLines = lineItems.map(
      (line) =>
        `• ${line.quantity}x ${line.variant.name} (${t.packLabel(line.variant.packSize)}) — ${formatFrs(
          line.quantity * line.variant.pricePerPack,
          lang,
        )}`,
    );
    const header =
      lang === 'fr'
        ? `Bonjour ${brandName}, je souhaite commander :`
        : `Hello ${brandName}, I would like to order:`;
    const totalLabel = `${t.subtotal}: ${formatFrs(subtotal, lang)}`;
    const waUrl = buildWhatsAppUrl(
      whatsappNumber,
      `${header}\n${summaryLines.join('\n')}\n${totalLabel}`,
    );
    setLastOrderUrl(waUrl);
    setOrderPlaced(true);
    onClearCart();

    const anchor = document.createElement('a');
    anchor.href = waUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleClose = () => {
    setOrderPlaced(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.bagTitle(brandName)}
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs"
    >
      <div className="flex-1" onClick={handleClose} aria-hidden="true" />
      <aside className="w-full max-w-md h-full bg-white dark:bg-[#0D0D10] text-zinc-900 dark:text-zinc-100 border-l border-zinc-200 dark:border-white/10 flex flex-col">
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4" />
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">
              {t.bagTitle(brandName)}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.closeAria}
            className="w-9 h-9 rounded-full border border-zinc-200 dark:border-white/15 inline-flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!orderPlaced && (
          <div className="px-6 py-3 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02]">
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              {remainingForFreeShipping === 0
                ? t.freeShippingUnlocked
                : t.freeShippingRemaining(formatFrs(remainingForFreeShipping, lang))}
            </p>
            <div className="mt-2 h-1 w-full bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full w-full origin-left transition-transform duration-300"
                style={{
                  backgroundColor: accentColor,
                  transform: `scaleX(${Math.min(1, subtotal / freeShippingThreshold)})`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {orderPlaced ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
              <CheckCircle2 className="w-10 h-10" style={{ color: accentColor }} />
              <h3 className="font-display text-2xl font-bold uppercase">
                {t.orderReserved}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">
                {t.orderConfirmedText(brandName)}
              </p>
              {lastOrderUrl && (
                <a
                  href={lastOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 h-11 px-6 rounded-full inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-transform duration-150 active:scale-95"
                  style={{
                    backgroundColor: accentColor,
                    color: '#09090B',
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.sendOrderWhatsApp}</span>
                </a>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="h-10 px-6 rounded-full border border-zinc-300 dark:border-white/20 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                {t.continueExploring}
              </button>
            </div>
          ) : lineItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-12">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.empty}</p>
              <button
                type="button"
                onClick={handleClose}
                className="h-10 px-5 rounded-full border border-zinc-300 dark:border-white/20 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                {t.browseFlavors}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-white/10">
              {lineItems.map(({ variant, quantity }) => (
                <div key={variant.id} className="py-5 flex items-center gap-4">
                  <img
                    src={variant.studioImage}
                    alt={variant.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-zinc-200 dark:bg-zinc-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold uppercase truncate">
                        {variant.name}
                      </h3>
                      <span className="font-mono-num text-sm font-semibold whitespace-nowrap">
                        {formatFrs(variant.pricePerPack * quantity, lang)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {variant.subtitle} · {t.packLabel(variant.packSize)}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-zinc-300 dark:border-white/15">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(variant.id, -1)}
                          aria-label={`Decrease ${variant.name} quantity`}
                          className="w-8 h-8 inline-flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono-num text-xs font-semibold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(variant.id, 1)}
                          aria-label={`Increase ${variant.name} quantity`}
                          className="w-8 h-8 inline-flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(variant.id)}
                        aria-label={`Remove ${variant.name}`}
                        className="p-1.5 text-zinc-400 hover:text-rose-500 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!orderPlaced && lineItems.length > 0 && (
          <div className="p-6 border-t border-zinc-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">{t.subtotal}</span>
              <span className="font-mono-num text-lg font-bold">
                {formatFrs(subtotal, lang)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full h-11 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer transition-transform duration-150 active:scale-[0.99]"
              style={{
                backgroundColor: accentColor,
                color: '#09090B',
              }}
            >
              {t.checkout}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
