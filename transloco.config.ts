import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'public/assets/i18n/', // <- here
  langs: [
    'ja-hrkt', 'ja-roj',
    'ko', 'zh-hans',
    'zh-hant', 'fr',
    'de', 'es',
    'is', 'en',
    'cs'
  ],
  keysManager: {}
};

export default config;