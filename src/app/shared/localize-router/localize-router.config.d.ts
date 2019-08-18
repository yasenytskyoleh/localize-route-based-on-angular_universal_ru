import { InjectionToken, Provider } from '@angular/core';
import { Routes } from '@angular/router';
import { LocalizeRouterModule } from './localize-router.module';
/**
 * Guard to make sure we have single initialization of forRoot
 * @type {InjectionToken<LocalizeRouterModule>}
 */
export declare const LOCALIZE_ROUTER_FORROOT_GUARD: InjectionToken<LocalizeRouterModule>;
/**
 * Static provider for keeping track of routes
 * @type {InjectionToken<Routes[]>}
 */
export declare const RAW_ROUTES: InjectionToken<Routes[]>;
/**
 * Type for Caching of default language
 */
export declare type CacheMechanism = 'LocalStorage' | 'Cookie';
/**
 * Namespace for fail proof access of CacheMechanism
 */
export declare namespace CacheMechanism {
    const LocalStorage: CacheMechanism;
    const Cookie: CacheMechanism;
}
/**
 * Boolean to indicate whether to use cached language value
 * @type {InjectionToken<boolean>}
 */
export declare const USE_CACHED_LANG: InjectionToken<boolean>;
/**
 * Cache mechanism type
 * @type {InjectionToken<CacheMechanism>}
 */
export declare const CACHE_MECHANISM: InjectionToken<CacheMechanism>;
/**
 * Cache name
 * @type {InjectionToken<string>}
 */
export declare const CACHE_NAME: InjectionToken<string>;
/**
 * Type for default language function
 * Used to override basic behaviour
 */
export declare type DefaultLanguageFunction = (languages: string[], cachedLang?: string, browserLang?: string) => string;
/**
 * Function for calculating default language
 * @type {InjectionToken<DefaultLanguageFunction>}
 */
export declare const DEFAULT_LANG_FUNCTION: InjectionToken<DefaultLanguageFunction>;
/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 * @type {InjectionToken<boolean>}
 */
export declare const ALWAYS_SET_PREFIX: InjectionToken<boolean>;
/**
 * Config interface for LocalizeRouter
 */
export interface LocalizeRouterConfig {
    parser?: Provider;
    useCachedLang?: boolean;
    cacheMechanism?: CacheMechanism;
    cacheName?: string;
    defaultLangFunction?: DefaultLanguageFunction;
    alwaysSetPrefix?: boolean;
    localizeRouteProperty?: boolean;
}
export declare class LocalizeRouterSettings implements LocalizeRouterConfig {
    useCachedLang: boolean;
    alwaysSetPrefix: boolean;
    cacheMechanism: CacheMechanism;
    cacheName: string;
    localizeRouteProperty: boolean;
    defaultLangFunction: DefaultLanguageFunction;
    /**
     * Settings for localize router
     * @param {boolean} useCachedLang
     * @param {boolean} alwaysSetPrefix
     * @param {CacheMechanism} cacheMechanism
     * @param {string} cacheName
     * @param {DefaultLanguageFunction} defaultLangFunction
     */
    constructor(useCachedLang?: boolean, alwaysSetPrefix?: boolean, cacheMechanism?: CacheMechanism, cacheName?: string, defaultLangFunction?: DefaultLanguageFunction);
}
