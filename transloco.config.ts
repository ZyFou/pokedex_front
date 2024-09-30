import {TranslocoGlobalConfig} from '@jsverse/transloco-utils';
    
const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'src/assets/i18n/',
  langs: [
    'ja-hrkt', 'ja-roj',
    'ko',      'zh-hans',
    'zh-hant', 'fr',
    'de',      'es',
    'is',      'en',
    'cs'
  ],
  keysManager: {}
};
    
export default config;