// Master translation registry for Vmove Logistics
// Supporting English + All 22 Constitutionally Scheduled Languages of India

import { LanguageCode } from './types';
import { en } from './locales/en';
import { hi } from './locales/hi';
import { bn } from './locales/bn';
import { mr } from './locales/mr';
import { te } from './locales/te';
import { ta } from './locales/ta';
import { gu } from './locales/gu';
import { ur } from './locales/ur';
import { kn } from './locales/kn';
import { or } from './locales/or';
import { ml } from './locales/ml';
import { pa } from './locales/pa';
import { as } from './locales/as';
import { mai } from './locales/mai';
import { sat } from './locales/sat';
import { ks } from './locales/ks';
import { ne } from './locales/ne';
import { sd } from './locales/sd';
import { doi } from './locales/doi';
import { kok } from './locales/kok';
import { mni } from './locales/mni';
import { brx } from './locales/brx';
import { sa } from './locales/sa';

export const translations: Record<LanguageCode, Record<string, string>> = {
  en,
  hi,
  bn,
  mr,
  te,
  ta,
  gu,
  ur,
  kn,
  or,
  ml,
  pa,
  as,
  mai,
  sat,
  ks,
  ne,
  sd,
  doi,
  kok,
  mni,
  brx,
  sa,
};
