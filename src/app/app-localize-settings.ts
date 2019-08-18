import { ILang } from './shared/translates';
import { LocalizeRouterSettings } from './shared/localize-router/localize-router.config';
import { TranslatesConfig } from './shared/translates/translates-config.interface';

export const LANG_LIST: ILang[] = [
    { code: 'ru', name: 'Русский', culture: 'ru-RU' },
    { code: 'en', name: 'English', culture: 'en-US' },
];

export const LANG_DEFAULT: ILang = LANG_LIST[0];

export const LOCALIZE_ROUTER_SETTINGS: LocalizeRouterSettings = {
    alwaysSetPrefix: false,
    cacheName: 'langCode',
    localizeRouteProperty: false
};

export const LOCALIZE_ROUTER_PREFIX: string = 'ROUTES.';

export const TRANSLATES_CONFIG: TranslatesConfig = {
    csrPath: '/assets/i18n/',
    ssrPath: './dist/assets/i18n/',
    fileType: '.json',
    prefix: 'i18n'

};
