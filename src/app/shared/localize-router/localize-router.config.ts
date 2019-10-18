import { Inject, InjectionToken, Provider } from '@angular/core';
import { Routes } from '@angular/router';
import { LocalizeRouterModule } from './localize-router.module';
import { LOCALIZE_ROUTER_SETTINGS } from 'app/app-localize-settings';


export const LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken<LocalizeRouterModule>('LOCALIZE_ROUTER_FORROOT_GUARD');

export const RAW_ROUTES: InjectionToken<Routes[]> = new InjectionToken<Routes[]>('RAW_ROUTES');

export type CacheMechanism = 'LocalStorage' | 'Cookie';

/**
 * Constants for fail proof access of CacheMechanism
 */

export const LocalStorage: CacheMechanism = 'LocalStorage';
export const Cookie: CacheMechanism = 'Cookie';


/**
 * Cache mechanism type
 */
export const CACHE_MECHANISM = new InjectionToken<CacheMechanism>('CACHE_MECHANISM');

/**
 * Boolean to indicate whether to use cached language value
 */
export const USE_CACHED_LANG = new InjectionToken<boolean>('USE_CACHED_LANG');

/**
 * Cache name
 */
export const CACHE_NAME = new InjectionToken<string>('CACHE_NAME');

/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 */
export const ALWAYS_SET_PREFIX = new InjectionToken<boolean>('ALWAYS_SET_PREFIX');

/**
 * Boolean to indicate translate routes segments
 */
export const LOCALIZE_ROUTE_PROPERTY = new InjectionToken<boolean>('LOCALIZE_ROUTE_PROPERTY');

/**
 * Config interface for LocalizeRouter
 */
export interface LocalizeRouterConfig {
  parser?: Provider;
  useCachedLang?: boolean;
  cacheName?: string;
  alwaysSetPrefix?: boolean;
  skipLocalizeRoute?: boolean;
  cacheMechanism?: string;
}

export const LOCALIZE_CACHE_NAME = 'langCode';

export class LocalizeRouterSettings implements LocalizeRouterConfig {
  /**
   * Settings for localize router
   */
  constructor(
    @Inject(USE_CACHED_LANG) public useCachedLang: boolean = LOCALIZE_ROUTER_SETTINGS.useCachedLang || true,
    @Inject(ALWAYS_SET_PREFIX) public alwaysSetPrefix: boolean = LOCALIZE_ROUTER_SETTINGS.alwaysSetPrefix || true,
    @Inject(CACHE_NAME) public cacheName: string = LOCALIZE_ROUTER_SETTINGS.cacheName || 'localizeDefaultLang',
    @Inject(LOCALIZE_ROUTE_PROPERTY) public skipLocalizeRoute: boolean = LOCALIZE_ROUTER_SETTINGS.skipLocalizeRoute || true,
    @Inject(CACHE_MECHANISM) public cacheMechanism: CacheMechanism = LOCALIZE_ROUTER_SETTINGS.cacheMechanism || LocalStorage,
  ) {
  }
}
