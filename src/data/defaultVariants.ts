import ctaFraiseImg from '../assets/images/cta_kossam_fraise_square_1794578114603.jpg';
import studioVanilleImg from '../assets/images/product_kossam_vanille_studio_1794578115649.jpg';
import { BrandConfig, DrinkVariant } from '../types/drink';

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  brandName: 'KOSSAM',
  brandTagline: 'Artisanal Cultured Yogurt Drinks',
  brandDescription:
    'Small-batch probiotic yogurt drinks crafted from pasture-raised whole milk, live active cultures, and real botanical infusions.',
  defaultMode: 'dark',
  whatsappNumber: '+237 6 81 31 62 46',
  socialLinks: {
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
};

export const DEFAULT_VARIANTS: DrinkVariant[] = [
  {
    id: 'fraise',
    name: 'FRAISE',
    subtitle: 'Yaourt Fraise',
    description:
      'Bright orchard strawberries folded into cool, tangy cultured yogurt for a clean berry finish. Crafted with real crushed fruit puree, live active cultures, and zero artificial dyes.',
    storyHeadline: 'Sun-ripened strawberries crushed into cool cultured yogurt.',
    storyBody:
      'Picked at peak summer sweetness and cold-milled into our signature ferment, Kossam Fraise delivers vibrant berry acidity against a crisp, spoonable-turned-drinkable texture.',
    themeColor: '#E11D48',
    modeOverride: 'inherit',
    sequencePattern: '/sequences/fraise/frame_{0001}.webp',
    frameCount: 120,
    pricePerPack: 400,
    packSize: 6,
    abvOrStyle: '250ml Glass Bottle · 6-Pack',
    tastingNotes: ['Wild Gariguette Strawberry', 'Tangy Cultured Dairy', 'Crisp Floral Finish'],
    studioImage: ctaFraiseImg,
    ctaImage: ctaFraiseImg,
    ingredients: [
      {
        name: 'Crushed Gariguette Strawberries',
        origin: 'Loire Valley Orchards',
        benefit: 'Natural ruby color, vitamin C, and bright aromatic fruit tartness.',
      },
      {
        name: 'Cultured Whole Milk',
        origin: 'Grass-Fed Normandy Herds',
        benefit: 'Slow-fermented base providing bioavailable calcium and 9g protein.',
      },
      {
        name: 'Live Active Yogurt Strains',
        origin: 'L. Bulgaricus & S. Thermophilus',
        benefit: 'Delivers 12 billion CFUs in every chilled glass bottle.',
      },
      {
        name: 'Chicory Inulin & Beet Juice',
        origin: 'Organic Botanical Extracts',
        benefit: 'Feeds beneficial gut flora while keeping added sugar low.',
      },
    ],
    nutrition: {
      servingSize: '1 Bottle (250ml)',
      servingsPerBottle: 1,
      calories: 155,
      totalFat: '4.8g',
      totalFatDv: '6%',
      saturatedFat: '3.0g',
      saturatedFatDv: '15%',
      cholesterol: '18mg',
      cholesterolDv: '6%',
      sodium: '90mg',
      sodiumDv: '4%',
      totalCarbs: '18g',
      totalCarbsDv: '7%',
      dietaryFiber: '4g',
      dietaryFiberDv: '14%',
      totalSugars: '13g',
      addedSugars: '5g',
      addedSugarsDv: '10%',
      protein: '9g',
      proteinDv: '18%',
      calcium: '270mg',
      calciumDv: '21%',
      potassium: '360mg',
      potassiumDv: '8%',
      liveCultures: '12 Billion CFU',
    },
  },
  {
    id: 'vanille',
    name: 'VANILLE',
    subtitle: 'Yaourt Onctueux',
    description:
      'Velvety cultured whole-milk yogurt infused with cured Madagascar Bourbon vanilla beans and warm roasted cacao nib notes. Silky, lightly sweet, and packed with billions of live probiotics.',
    storyHeadline: 'Silky fermented cream meets cured Madagascar vanilla.',
    storyBody:
      'Fermented slowly for 14 hours in cold-chain vats, Kossam Vanille balances lush dairy richness with real vanilla bean caviar and zero synthetic thickeners.',
    themeColor: '#E6C280',
    modeOverride: 'inherit',
    sequencePattern: '/sequences/vanille/frame_{0001}.webp',
    frameCount: 120,
    pricePerPack: 400,
    packSize: 6,
    abvOrStyle: '250ml Glass Bottle · 6-Pack',
    tastingNotes: ['Madagascar Vanilla Bean', 'Cultured Cream', 'Toasted Oat Finish'],
    studioImage: studioVanilleImg,
    ctaImage: ctaFraiseImg,
    ingredients: [
      {
        name: 'Pasteurized Whole Milk',
        origin: 'Grass-Fed Normandy Herds',
        benefit: 'Complete dairy protein and velvety mouthfeel without gums or stabilizers.',
      },
      {
        name: 'Madagascar Vanilla Pods',
        origin: 'Sava Region, Madagascar',
        benefit: 'Aromatic vanillin warmth infused directly into the warm ferment.',
      },
      {
        name: 'Live Probiotic Cultures',
        origin: '5 Active Yogurt Strains',
        benefit: '12 billion CFUs per bottle supporting daily digestive balance.',
      },
      {
        name: 'Organic Cane Sugar & Prebiotic Fiber',
        origin: 'Cold-Pressed Chicory Root',
        benefit: 'Gentle sweetness paired with 4g plant-based prebiotic fiber.',
      },
    ],
    nutrition: {
      servingSize: '1 Bottle (250ml)',
      servingsPerBottle: 1,
      calories: 165,
      totalFat: '5.5g',
      totalFatDv: '7%',
      saturatedFat: '3.4g',
      saturatedFatDv: '17%',
      cholesterol: '20mg',
      cholesterolDv: '7%',
      sodium: '95mg',
      sodiumDv: '4%',
      totalCarbs: '19g',
      totalCarbsDv: '7%',
      dietaryFiber: '4g',
      dietaryFiberDv: '14%',
      totalSugars: '13g',
      addedSugars: '6g',
      addedSugarsDv: '12%',
      protein: '9g',
      proteinDv: '18%',
      calcium: '280mg',
      calciumDv: '22%',
      potassium: '340mg',
      potassiumDv: '7%',
      liveCultures: '12 Billion CFU',
    },
  },
];

export const CTA_SQUARE_IMAGE = ctaFraiseImg;
export const STUDIO_VANILLE_IMAGE = studioVanilleImg;
