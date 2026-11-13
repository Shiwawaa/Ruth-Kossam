import { DrinkVariant, IngredientItem, Language } from '../types/drink';
import { DEFAULT_BRAND_CONFIG, DEFAULT_VARIANTS } from '../data/defaultVariants';

export function formatFrs(amount: number, lang: Language): string {
  const formatted = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} Frs`;
}

export function buildWhatsAppUrl(phoneNumber: string, message?: string): string {
  const digits = phoneNumber.replace(/\D/g, '') || '237681316246';
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function normalizeSocialUrl(raw: string, fallback: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

interface LocalizedVariantFields {
  subtitle: string;
  description: string;
  storyHeadline: string;
  storyBody: string;
  abvOrStyle: string;
  tastingNotes: string[];
  servingSize: string;
  liveCultures: string;
  ingredients: IngredientItem[];
}

const FR_VARIANT_TRANSLATIONS: Record<string, LocalizedVariantFields> = {
  vanille: {
    subtitle: 'Yaourt Onctueux',
    description:
      'Yaourt onctueux au lait entier fermenté, infusé aux gousses de vanille Bourbon de Madagascar et relevé de fines notes de cacao torréfié. Velouté, légèrement sucré et riche en ferments actifs vivants.',
    storyHeadline: 'Une crème fermentée soyeuse infusée à la vanille de Madagascar.',
    storyBody:
      'Fermenté lentement pendant 14 heures en cuve réfrigérée, Kossam Vanille marie la richesse du lait entier aux grains de vanille Bourbon sans aucun épaississant synthétique.',
    abvOrStyle: 'Bouteille verre 250ml · Pack de 6',
    tastingNotes: ['Vanille de Madagascar', 'Crème Fermentée', 'Finale Avoine Grillée'],
    servingSize: '1 Bouteille (250ml)',
    liveCultures: '12 Milliards UFC',
    ingredients: [
      {
        name: 'Lait Entier Pasteurisé',
        origin: 'Élevages en Pâturage',
        benefit: 'Protéines laitières complètes et texture veloutée sans gommes ni stabilisants.',
      },
      {
        name: 'Gousses de Vanille de Madagascar',
        origin: 'Région de la Sava, Madagascar',
        benefit: 'Chaleur aromatique de vanilline infusée directement dans le ferment tiède.',
      },
      {
        name: 'Ferments Probiotiques Vivants',
        origin: '5 Souches Actives de Yaourt',
        benefit: '12 milliards d’UFC par bouteille pour soutenir l’équilibre digestif quotidien.',
      },
      {
        name: 'Sucre de Canne Bio & Fibres Prébiotiques',
        origin: 'Racine de Chicorée Pressée à Froid',
        benefit: 'Douceur délicate associée à 4g de fibres prébiotiques végétales.',
      },
    ],
  },
  fraise: {
    subtitle: 'Yaourt Fraise',
    description:
      'Fraises de verger mûries au soleil et incorporées dans un yaourt frais et velouté pour une finale fruitée nette. Élaboré avec de vrais fruits pressés, des ferments vivants et sans colorants artificiels.',
    storyHeadline: 'Des fraises gorgées de soleil mêlées à un yaourt frais fermenté.',
    storyBody:
      'Cueillies à pleine maturité estivale et pressées à froid dans notre base fermentée signature, Kossam Fraise offre une acidité fruitée éclatante sur une texture fraîche et fluide.',
    abvOrStyle: 'Bouteille verre 250ml · Pack de 6',
    tastingNotes: ['Fraise Gariguette', 'Yaourt Frais Acidulé', 'Finale Florale Nette'],
    servingSize: '1 Bouteille (250ml)',
    liveCultures: '12 Milliards UFC',
    ingredients: [
      {
        name: 'Fraises Gariguette Écrasées',
        origin: 'Vergers de Saison',
        benefit: 'Couleur rubis naturelle, vitamine C et fraîcheur aromatique du fruit.',
      },
      {
        name: 'Lait Entier Fermenté',
        origin: 'Élevages en Pâturage',
        benefit: 'Base fermentée lentement offrant calcium biodisponible et 9g de protéines.',
      },
      {
        name: 'Ferments Actifs de Yaourt',
        origin: 'L. Bulgaricus & S. Thermophilus',
        benefit: 'Apporte 12 milliards d’UFC dans chaque bouteille en verre réfrigérée.',
      },
      {
        name: 'Inuline de Chicorée & Jus de Betterave',
        origin: 'Extraits Botaniques Bio',
        benefit: 'Nourrit la flore intestinale tout en gardant un taux de sucre ajouté modéré.',
      },
    ],
  },
};

export function localizeVariant(variant: DrinkVariant, lang: Language): DrinkVariant {
  if (lang === 'en') return variant;
  const fr = FR_VARIANT_TRANSLATIONS[variant.id];
  if (!fr) return variant;

  const baseEn = DEFAULT_VARIANTS.find((v) => v.id === variant.id);
  if (!baseEn) return variant;

  return {
    ...variant,
    subtitle: variant.subtitle === baseEn.subtitle ? fr.subtitle : variant.subtitle,
    description: variant.description === baseEn.description ? fr.description : variant.description,
    storyHeadline:
      variant.storyHeadline === baseEn.storyHeadline ? fr.storyHeadline : variant.storyHeadline,
    storyBody: variant.storyBody === baseEn.storyBody ? fr.storyBody : variant.storyBody,
    abvOrStyle: variant.abvOrStyle === baseEn.abvOrStyle ? fr.abvOrStyle : variant.abvOrStyle,
    tastingNotes: fr.tastingNotes,
    ingredients: fr.ingredients,
    nutrition: {
      ...variant.nutrition,
      servingSize: fr.servingSize,
      liveCultures: fr.liveCultures,
    },
  };
}

export function localizeBrandDescription(description: string, lang: Language): string {
  if (lang === 'fr' && description === DEFAULT_BRAND_CONFIG.brandDescription) {
    return 'Boissons lactées probiotiques en petites séries, élaborées à partir de lait entier de pâturage, de ferments actifs vivants et d’infusions botaniques réelles.';
  }
  return description;
}

export const UI_COPY = {
  en: {
    preloader: {
      preparing: 'Preparing sequence',
      loading: 'Loading',
    },
    nav: {
      product: 'Product',
      ingredients: 'Ingredients',
      nutrition: 'Nutrition',
      reviews: 'Reviews',
      faq: 'FAQ',
      contact: 'Contact',
      bag: 'Bag',
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode',
      switchLangLabel: 'Switch language to French',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    hero: {
      addToCart: 'Add to Cart',
      customize: 'Customize',
      prev: 'Prev',
      next: 'Next',
      prevAria: 'Previous flavor variant',
      nextAria: 'Next flavor variant',
      scroll: 'SCROLL',
    },
    sections: {
      aboutPrefix: 'About',
      notes: 'Notes',
      packUnit: 'pack',
      addPack: 'Add',
      packSuffix: '6-Pack',
      editSpecs: 'Edit Flavor Specs',
      ingredientsKicker: 'Ingredients & Benefits',
      ingredientsTitle: 'Four clean ingredients. Zero compromises.',
      ingredientsSub: (brand: string, flavor: string) =>
        `Every bottle of ${brand} ${flavor} combines slow-fermented dairy with traceable botanicals and prebiotic chicory root.`,
      nutritionKicker: 'Nutrition Profile',
      nutritionTitle: 'Balanced energy, daily probiotics.',
      nutritionSub:
        'Naturally rich in complete milk protein, calcium, and 12 billion live active cultures per chilled 250ml glass bottle.',
      completeProtein: 'Complete Protein',
      liveProbiotic: 'Live Probiotic CFU',
      prebioticFiber: 'Prebiotic Fiber',
      nutritionFacts: 'Nutrition Facts',
      servingPerBottle: (n: number) => `${n} serving per bottle`,
      servingSize: 'Serving size',
      amountPerServing: 'Amount per serving',
      calories: 'Calories',
      dailyValue: '% Daily Value*',
      totalFat: 'Total Fat',
      saturatedFat: 'Saturated Fat',
      cholesterol: 'Cholesterol',
      sodium: 'Sodium',
      totalCarb: 'Total Carbohydrate',
      dietaryFiber: 'Dietary Fiber',
      totalSugars: 'Total Sugars',
      inclAdded: (v: string) => `Incl. ${v} Added`,
      protein: 'Protein',
      calcium: 'Calcium',
      potassium: 'Potassium',
      liveActiveCultures: 'Live Active Cultures',
      reviewsKicker: 'Verified Reviews',
      reviewsTitle: 'Trusted by kitchens and coaches.',
      deliveriesCount: '1,240 chilled deliveries',
      reviews: [
        {
          id: 'rev-1',
          name: 'Camille Laurent',
          role: 'Pastry Chef, Lyon',
          flavor: 'Vanille',
          rating: 5,
          quote:
            'I replaced heavy afternoon desserts with chilled Kossam Vanille three months ago. The real Madagascar vanilla specks and cultured tang give me clean sweetness with zero sugar crash.',
        },
        {
          id: 'rev-2',
          name: 'Marcus Vance',
          role: 'Endurance Coach, Austin',
          flavor: 'Fraise',
          rating: 5,
          quote:
            'My athletes struggled with chalky protein shakes after morning track sessions. Switching to 250ml bottles of Kossam Fraise gave them 9g bioavailable dairy protein they genuinely crave.',
        },
        {
          id: 'rev-3',
          name: 'Nadia Benali',
          role: 'Buyer, Atelier Marche Paris',
          flavor: 'Vanille & Fraise',
          rating: 5,
          quote:
            'Before stocking Kossam, our functional beverage shelf had high turnover fatigue. Both glass-bottled flavors reached 88% weekly sell-through within six weeks of launch.',
        },
      ],
      faqKicker: 'FAQ',
      faqTitle: 'Questions answered cleanly.',
      faqs: [
        {
          q: 'How should Kossam yogurt drinks be stored?',
          a: 'Kossam is made with live active probiotic cultures and zero heat-pasteurization after fermentation. Keep bottles refrigerated between 2°C and 6°C (35°F–43°F), and shake gently before pouring.',
        },
        {
          q: 'What makes Kossam different from conventional drinkable yogurts?',
          a: 'We ferment pasture-raised whole milk slowly for 14 hours and infuse whole Madagascar vanilla pods or crushed Gariguette strawberries without carrageenan, synthetic dyes, or artificial sweeteners.',
        },
        {
          q: 'How are orders shipped to stay cold?',
          a: 'Every 6-pack ships in insulated, recyclable fiber liners paired with food-safe gel packs via 48-hour chilled express courier so bottles arrive cold to your door.',
        },
        {
          q: 'Can I customize flavor names, colors, or WebP parallax sequences?',
          a: 'Yes. Click any Customize button on the page to open the live studio drawer—you can edit drink names, descriptions, accent colors, light/dark mode, and WebP sequence URLs in real time.',
        },
      ],
      ctaKicker: 'Direct Chilled Delivery · Wholesale',
      ctaTitle: (brand: string) => `Bring ${brand} to your fridge or shelf.`,
      ctaSub:
        'Order a chilled 6-pack direct from our creamery or reach out below for café, hotel, and specialty grocery wholesale pricing.',
      orderBtn: (flavor: string, priceStr: string) => `Order ${flavor} · ${priceStr}`,
      customizeLineup: 'Customize Lineup',
      sendMessage: 'Send a Message',
      replyTime: 'Replies within 1 business day',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'Phone or email',
      msgPlaceholder: 'Ask about delivery dates, stockists, or wholesale orders...',
      contactError: 'Please enter your name, a valid phone number or email, and a short message.',
      contactSuccess: 'Message prepared for WhatsApp. Click below if WhatsApp did not open automatically.',
      sendInquiry: 'Send via WhatsApp',
      openWhatsApp: 'Open WhatsApp Chat',
      directWhatsApp: 'Chat on WhatsApp',
    },
    footer: {
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms',
      rights: 'Ruth Kossam — an AMG product. All rights reserved.',
      craft: 'Small-batch cultured dairy',
      keepCold: 'Keep refrigerated',
      privacyText: (brand: string) =>
        `${brand} collects only the details needed to fulfill chilled beverage deliveries and respond to wholesale inquiries. Customizer presets remain stored locally in your browser.`,
      termsText: (brand: string) =>
        `All ${brand} 6-pack deliveries ship refrigerated via express cold-chain courier. Inspect your chilled liner on arrival and refrigerate bottles immediately at 2°C–6°C.`,
      close: 'Close',
    },
    cart: {
      bagTitle: (brand: string) => `${brand} Bag`,
      closeAria: 'Close bag',
      freeShippingUnlocked: 'Unlocked complimentary 48h chilled express delivery.',
      freeShippingRemaining: (amountStr: string) =>
        `Add ${amountStr} more for complimentary chilled delivery.`,
      orderReserved: 'Order Reserved',
      orderConfirmedText: (brand: string) =>
        `Your chilled ${brand} pack order is ready to send via WhatsApp for fast confirmation.`,
      sendOrderWhatsApp: 'Send Order on WhatsApp',
      continueExploring: 'Continue Exploring',
      empty: 'Your bag is currently empty.',
      browseFlavors: 'Browse Flavors',
      packLabel: (n: number) => `${n}-Pack`,
      subtotal: 'Subtotal',
      checkout: 'Complete Chilled Order',
    },
    customizer: {
      title: 'Brand & Sequence Studio',
      resetAria: 'Reset all defaults',
      closeAria: 'Close customizer',
      brandSection: 'Brand Identity & Global Theme',
      brandNameLabel: 'Brand / Drink Name',
      globalModeLabel: 'Global Mode',
      dark: 'dark',
      light: 'light',
      brandStoryLabel: 'Brand Story Summary',
      activeVariantLabel: 'Active Variant',
      addVariant: 'Add Variant',
      flavorName: 'Flavor Name',
      subtitle: 'Subtitle',
      heroDescription: 'Hero Description (1–3 sentences)',
      themeColor: 'Theme Accent Color',
      modeOverride: 'Variant Mode Override',
      activeLabel: 'Active',
      inheritGlobal: 'Inherit Global Mode',
      forceDark: 'Force Dark Mode',
      forceLight: 'Force Light Mode',
      sequenceUrl: 'WebP Sequence URL Pattern',
      frames: 'Frames',
      removeVariant: 'Remove This Variant',
      savedNote: 'Changes apply immediately & save locally',
      done: 'Done',
      contactSocialSection: 'WhatsApp & Social Links',
      whatsappLabel: 'WhatsApp Number',
      facebookLabel: 'Facebook URL',
      instagramLabel: 'Instagram URL',
      twitterLabel: 'Twitter / X URL',
    },
  },
  fr: {
    preloader: {
      preparing: 'Préparation de la séquence',
      loading: 'Chargement',
    },
    nav: {
      product: 'Produit',
      ingredients: 'Ingrédients',
      nutrition: 'Nutrition',
      reviews: 'Avis',
      faq: 'FAQ',
      contact: 'Contact',
      bag: 'Panier',
      switchToLight: 'Passer en mode clair',
      switchToDark: 'Passer en mode sombre',
      switchLangLabel: 'Passer la langue en anglais',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
    },
    hero: {
      addToCart: 'Ajouter au panier',
      customize: 'Personnaliser',
      prev: 'Préc',
      next: 'Suiv',
      prevAria: 'Saveur précédente',
      nextAria: 'Saveur suivante',
      scroll: 'DÉFILER',
    },
    sections: {
      aboutPrefix: 'À propos de',
      notes: 'Notes',
      packUnit: 'pack',
      addPack: 'Ajouter',
      packSuffix: 'Pack de 6',
      editSpecs: 'Modifier la saveur',
      ingredientsKicker: 'Ingrédients & Bienfaits',
      ingredientsTitle: 'Quatre ingrédients purs. Zéro compromis.',
      ingredientsSub: (brand: string, flavor: string) =>
        `Chaque bouteille de ${brand} ${flavor} associe un lait fermenté lentement à des ingrédients botaniques traçables et à la racine de chicorée.`,
      nutritionKicker: 'Profil Nutritionnel',
      nutritionTitle: 'Énergie équilibrée, probiotiques quotidiens.',
      nutritionSub:
        'Naturellement riche en protéines laitières complètes, calcium et 12 milliards de ferments actifs vivants par bouteille réfrigérée de 250ml.',
      completeProtein: 'Protéines Complètes',
      liveProbiotic: 'Ferments Actifs UFC',
      prebioticFiber: 'Fibres Prébiotiques',
      nutritionFacts: 'Valeurs Nutritionnelles',
      servingPerBottle: (n: number) => `${n} portion par bouteille`,
      servingSize: 'Portion',
      amountPerServing: 'Quantité par portion',
      calories: 'Calories',
      dailyValue: '% Valeur Quotidienne*',
      totalFat: 'Matières grasses',
      saturatedFat: 'Acides gras saturés',
      cholesterol: 'Cholestérol',
      sodium: 'Sodium',
      totalCarb: 'Glucides totaux',
      dietaryFiber: 'Fibres alimentaires',
      totalSugars: 'Sucres totaux',
      inclAdded: (v: string) => `Dont ${v} ajoutés`,
      protein: 'Protéines',
      calcium: 'Calcium',
      potassium: 'Potassium',
      liveActiveCultures: 'Ferments lactiques vivants',
      reviewsKicker: 'Avis Vérifiés',
      reviewsTitle: 'Adopté par les chefs et les sportifs.',
      deliveriesCount: '1 240 livraisons fraîches',
      reviews: [
        {
          id: 'rev-1',
          name: 'Camille Laurent',
          role: 'Cheffe Pâtissière, Lyon',
          flavor: 'Vanille',
          rating: 5,
          quote:
            'J’ai remplacé les desserts lourds de l’après-midi par Kossam Vanille bien frais depuis trois mois. Les vrais grains de vanille de Madagascar et la pointe acidulée offrent une douceur nette.',
        },
        {
          id: 'rev-2',
          name: 'Marcus Vance',
          role: 'Coach d’Endurance, Dakar',
          flavor: 'Fraise',
          rating: 5,
          quote:
            'Mes athlètes avaient du mal avec les boissons protéinées poudreuses après l’entraînement. Les bouteilles de 250ml de Kossam Fraise leur apportent 9g de protéines laitières avec plaisir.',
        },
        {
          id: 'rev-3',
          name: 'Nadia Benali',
          role: 'Acheteuse, Atelier Marché Paris',
          flavor: 'Vanille & Fraise',
          rating: 5,
          quote:
            'Nos clients recherchaient des boissons fonctionnelles authentiques sans additifs. Les deux saveurs en bouteille en verre ont atteint 88 % de rotation hebdomadaire en six semaines.',
        },
      ],
      faqKicker: 'FAQ',
      faqTitle: 'Vos questions, nos réponses claires.',
      faqs: [
        {
          q: 'Comment conserver les yaourts à boire Kossam ?',
          a: 'Kossam contient des ferments probiotiques vivants sans pasteurisation thermique après fermentation. Conservez les bouteilles au réfrigérateur entre 2°C et 6°C et agitez doucement avant de servir.',
        },
        {
          q: 'Qu’est-ce qui distingue Kossam des yaourts industriels ?',
          a: 'Nous fermentons du lait entier de pâturage pendant 14 heures et infusons de vraies gousses de vanille de Madagascar ou des fraises Gariguette écrasées, sans carraghénane ni arômes artificiels.',
        },
        {
          q: 'Comment les commandes restent-elles fraîches durant la livraison ?',
          a: 'Chaque pack de 6 est expédié dans un emballage isotherme recyclable avec accumulateurs de froid par coursier express réfrigéré en 48h.',
        },
        {
          q: 'Puis-je personnaliser les noms, les couleurs ou les séquences WebP ?',
          a: 'Oui. Cliquez sur Personnaliser pour ouvrir le studio en direct : modifiez le nom de la marque, les saveurs, les couleurs, le mode clair/sombre et les séquences WebP instantanément.',
        },
      ],
      ctaKicker: 'Livraison Fraîche Directe · Grossiste',
      ctaTitle: (brand: string) => `Invitez ${brand} dans votre quotidien ou rayon.`,
      ctaSub:
        'Commandez un pack de 6 frais directement depuis notre laiterie ou contactez-nous ci-dessous pour les tarifs cafés, hôtels et épiceries fines.',
      orderBtn: (flavor: string, priceStr: string) => `Commander ${flavor} · ${priceStr}`,
      customizeLineup: 'Personnaliser la gamme',
      sendMessage: 'Envoyer un message',
      replyTime: 'Réponse sous 1 jour ouvré',
      namePlaceholder: 'Votre nom',
      emailPlaceholder: 'Téléphone ou e-mail',
      msgPlaceholder: 'Questions sur la livraison, les points de vente ou les commandes pros...',
      contactError: 'Veuillez saisir votre nom, un numéro ou e-mail valide et un court message.',
      contactSuccess: 'Message prêt pour WhatsApp. Cliquez ci-dessous si WhatsApp ne s’est pas ouvert.',
      sendInquiry: 'Envoyer sur WhatsApp',
      openWhatsApp: 'Ouvrir WhatsApp',
      directWhatsApp: 'Discuter sur WhatsApp',
    },
    footer: {
      about: 'À propos',
      contact: 'Contact',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      rights: 'kossam de Ruth — un produit de AMG. Tous droits réservés.',
      craft: 'Laiterie fermentée en petites séries',
      keepCold: 'À conserver au frais',
      privacyText: (brand: string) =>
        `${brand} collecte uniquement les informations nécessaires à la livraison réfrigérée et aux demandes professionnelles. Vos réglages du studio restent stockés localement dans votre navigateur.`,
      termsText: (brand: string) =>
        `Toutes les livraisons de packs ${brand} sont expédiées sous chaîne du froid. Vérifiez le colis isotherme à réception et placez les bouteilles entre 2°C et 6°C.`,
      close: 'Fermer',
    },
    cart: {
      bagTitle: (brand: string) => `Panier ${brand}`,
      closeAria: 'Fermer le panier',
      freeShippingUnlocked: 'Livraison express réfrigérée 48h offerte débloquée.',
      freeShippingRemaining: (amountStr: string) =>
        `Ajoutez ${amountStr} pour profiter de la livraison fraîche offerte.`,
      orderReserved: 'Commande Réservée',
      orderConfirmedText: (brand: string) =>
        `Votre commande de packs ${brand} est prête à être envoyée sur WhatsApp pour confirmation rapide.`,
      sendOrderWhatsApp: 'Envoyer la commande sur WhatsApp',
      continueExploring: 'Continuer la visite',
      empty: 'Votre panier est actuellement vide.',
      browseFlavors: 'Découvrir les saveurs',
      packLabel: (n: number) => `Pack de ${n}`,
      subtotal: 'Sous-total',
      checkout: 'Valider la commande fraîche',
    },
    customizer: {
      title: 'Studio Marque & Séquence',
      resetAria: 'Réinitialiser par défaut',
      closeAria: 'Fermer le studio',
      brandSection: 'Identité de Marque & Thème Global',
      brandNameLabel: 'Nom de la marque / boisson',
      globalModeLabel: 'Mode global',
      dark: 'sombre',
      light: 'clair',
      brandStoryLabel: 'Présentation de la marque',
      activeVariantLabel: 'Variante active',
      addVariant: 'Ajouter une variante',
      flavorName: 'Nom de la saveur',
      subtitle: 'Sous-titre',
      heroDescription: 'Description Hero (1–3 phrases)',
      themeColor: 'Couleur d’accentuation',
      modeOverride: 'Mode spécifique à la variante',
      activeLabel: 'Actif',
      inheritGlobal: 'Suivre le mode global',
      forceDark: 'Forcer le mode sombre',
      forceLight: 'Forcer le mode clair',
      sequenceUrl: 'Modèle d’URL séquence WebP',
      frames: 'Images',
      removeVariant: 'Supprimer cette variante',
      savedNote: 'Modifications appliquées en direct et sauvegardées localement',
      done: 'Terminer',
      contactSocialSection: 'WhatsApp & Réseaux Sociaux',
      whatsappLabel: 'Numéro WhatsApp',
      facebookLabel: 'Lien Facebook',
      instagramLabel: 'Lien Instagram',
      twitterLabel: 'Lien Twitter / X',
    },
  },
} as const;
