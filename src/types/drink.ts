export type ThemeMode = 'dark' | 'light';
export type VariantModeOverride = 'inherit' | 'dark' | 'light';
export type Language = 'en' | 'fr';

export interface NutritionProfile {
  servingSize: string;
  servingsPerBottle: number;
  calories: number;
  totalFat: string;
  totalFatDv: string;
  saturatedFat: string;
  saturatedFatDv: string;
  cholesterol: string;
  cholesterolDv: string;
  sodium: string;
  sodiumDv: string;
  totalCarbs: string;
  totalCarbsDv: string;
  dietaryFiber: string;
  dietaryFiberDv: string;
  totalSugars: string;
  addedSugars: string;
  addedSugarsDv: string;
  protein: string;
  proteinDv: string;
  calcium: string;
  calciumDv: string;
  potassium: string;
  potassiumDv: string;
  liveCultures: string;
}

export interface IngredientItem {
  name: string;
  origin: string;
  benefit: string;
}

export interface DrinkVariant {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  storyHeadline: string;
  storyBody: string;
  themeColor: string;
  modeOverride: VariantModeOverride;
  sequencePattern: string;
  frameCount: number;
  pricePerPack: number;
  packSize: number;
  abvOrStyle: string;
  tastingNotes: string[];
  studioImage: string;
  ctaImage: string;
  ingredients: IngredientItem[];
  nutrition: NutritionProfile;
}

export interface SocialLinks {
  twitter: string;
  instagram: string;
  facebook: string;
}

export interface BrandConfig {
  brandName: string;
  brandTagline: string;
  brandDescription: string;
  defaultMode: ThemeMode;
  whatsappNumber: string;
  socialLinks: SocialLinks;
}

export interface CartItem {
  variantId: string;
  quantity: number;
}
