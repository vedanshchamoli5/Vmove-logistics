// Supported Languages for Vmove Logistics
// English + All 22 Constitutionally Scheduled Languages of India (Eighth Schedule)

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'mr'
  | 'te'
  | 'ta'
  | 'gu'
  | 'ur'
  | 'kn'
  | 'or'
  | 'ml'
  | 'pa'
  | 'as'
  | 'mai'
  | 'sat'
  | 'ks'
  | 'ne'
  | 'sd'
  | 'doi'
  | 'kok'
  | 'mni'
  | 'brx'
  | 'sa';

export interface LanguageMeta {
  code: LanguageCode;
  label: string;
  nativeName: string;
  region: string;
  script: string;
  bcp47: string;
  isRTL: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    region: 'Pan-India Commercial',
    script: 'Latin',
    bcp47: 'en-IN',
    isRTL: false,
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'North & Central India',
    script: 'Devanagari',
    bcp47: 'hi-IN',
    isRTL: false,
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeName: 'বাংলা',
    region: 'West Bengal & Eastern Corridors',
    script: 'Bengali',
    bcp47: 'bn-IN',
    isRTL: false,
  },
  {
    code: 'mr',
    label: 'Marathi',
    nativeName: 'मराठी',
    region: 'Maharashtra / Western Belt',
    script: 'Devanagari',
    bcp47: 'mr-IN',
    isRTL: false,
  },
  {
    code: 'te',
    label: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Telangana & Andhra Pradesh',
    script: 'Telugu',
    bcp47: 'te-IN',
    isRTL: false,
  },
  {
    code: 'ta',
    label: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu & Southern Hubs',
    script: 'Tamil',
    bcp47: 'ta-IN',
    isRTL: false,
  },
  {
    code: 'gu',
    label: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'Gujarat Industrial Belt',
    script: 'Gujarati',
    bcp47: 'gu-IN',
    isRTL: false,
  },
  {
    code: 'ur',
    label: 'Urdu',
    nativeName: 'اردو',
    region: 'Pan-India Commercial',
    script: 'Perso-Arabic (Nastaliq)',
    bcp47: 'ur-IN',
    isRTL: true,
  },
  {
    code: 'kn',
    label: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'Karnataka / Bengaluru Belt',
    script: 'Kannada',
    bcp47: 'kn-IN',
    isRTL: false,
  },
  {
    code: 'or',
    label: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    region: 'Odisha & Eastern Coastal Belt',
    script: 'Odia',
    bcp47: 'or-IN',
    isRTL: false,
  },
  {
    code: 'ml',
    label: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'Kerala & Coastal Corridors',
    script: 'Malayalam',
    bcp47: 'ml-IN',
    isRTL: false,
  },
  {
    code: 'pa',
    label: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'Punjab & Northern Freight Hubs',
    script: 'Gurmukhi',
    bcp47: 'pa-IN',
    isRTL: false,
  },
  {
    code: 'as',
    label: 'Assamese',
    nativeName: 'অসমীয়া',
    region: 'Assam & North East Gateway',
    script: 'Bengali-Assamese',
    bcp47: 'as-IN',
    isRTL: false,
  },
  {
    code: 'mai',
    label: 'Maithili',
    nativeName: 'मैथिली',
    region: 'Bihar & Mithila Region',
    script: 'Devanagari',
    bcp47: 'mai-IN',
    isRTL: false,
  },
  {
    code: 'sat',
    label: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    region: 'Jharkhand, Odisha & Bengal',
    script: 'Ol Chiki',
    bcp47: 'sat-Olck-IN',
    isRTL: false,
  },
  {
    code: 'ks',
    label: 'Kashmiri',
    nativeName: 'كٲشُر',
    region: 'Jammu & Kashmir Freight Corridors',
    script: 'Perso-Arabic',
    bcp47: 'ks-Arab-IN',
    isRTL: true,
  },
  {
    code: 'ne',
    label: 'Nepali',
    nativeName: 'नेपाली',
    region: 'Sikkim & Himalayan Corridors',
    script: 'Devanagari',
    bcp47: 'ne-IN',
    isRTL: false,
  },
  {
    code: 'sd',
    label: 'Sindhi',
    nativeName: 'سنڌي',
    region: 'Western India & Commercial Ports',
    script: 'Perso-Arabic',
    bcp47: 'sd-Arab-IN',
    isRTL: true,
  },
  {
    code: 'doi',
    label: 'Dogri',
    nativeName: 'डोगरी',
    region: 'Jammu Region & Northern Belt',
    script: 'Devanagari',
    bcp47: 'doi-IN',
    isRTL: false,
  },
  {
    code: 'kok',
    label: 'Konkani',
    nativeName: 'कोंकणी',
    region: 'Goa & Konkan Coastal Route',
    script: 'Devanagari',
    bcp47: 'kok-IN',
    isRTL: false,
  },
  {
    code: 'mni',
    label: 'Manipuri (Meitei)',
    nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ',
    region: 'Manipur & Imphal Valley',
    script: 'Meitei Mayek',
    bcp47: 'mni-Mtei-IN',
    isRTL: false,
  },
  {
    code: 'brx',
    label: 'Bodo',
    nativeName: 'बड़ो',
    region: 'Bodoland & Lower Assam',
    script: 'Devanagari',
    bcp47: 'brx-IN',
    isRTL: false,
  },
  {
    code: 'sa',
    label: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    region: 'Pan-India Classical Language',
    script: 'Devanagari',
    bcp47: 'sa-IN',
    isRTL: false,
  },
];
