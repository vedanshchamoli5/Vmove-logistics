export type LanguageCode = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn' | 'bn' | 'pa';

export interface LanguageMeta {
  code: LanguageCode;
  label: string;
  nativeName: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', nativeName: 'English', region: 'Pan-India Commercial' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', region: 'North & Central India' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra / Western Belt' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat Industrial Belt' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu & Southern Hubs' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', region: 'Telangana & Andhra Pradesh' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka / Bengaluru Belt' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal & Eastern Corridors' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab & Northern Freight Hubs' },
];
