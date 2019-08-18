import { Inject, InjectionToken, Provider } from '@angular/core';
import { Routes } from '@angular/router';
import { LocalizeRouterModule } from './localize-router.module';
import { LOCALIZE_ROUTER_SETTINGS } from '../../app-localize-settings';

/**
 * Guard to make sure we have single initialization of forRoot
 * @type {InjectionToken<LocalizeRouterModule>}
 */
export const LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken<LocalizeRouterModule>('LOCALIZE_ROUTER_FORROOT_GUARD');

/**
 * Static provider for keeping track of routes
 * @type {InjectionToken<Routes[]>}
 */
export const RAW_ROUTES: InjectionToken<Routes[]> = new InjectionToken<Routes[]>('RAW_ROUTES');

/**
 * Cache name
 * @type {InjectionToken<string>}
 */
export const CACHE_NAME = new InjectionToken<string>('CACHE_NAME');

/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 * @type {InjectionToken<boolean>}
 */
export const ALWAYS_SET_PREFIX = new InjectionToken<boolean>('ALWAYS_SET_PREFIX');

/**
 * Boolean to indicate translate routes segments
 * @type {InjectionToken<boolean>}
 */
export const LOCALIZE_ROUTE_PROPERTY = new InjectionToken<boolean>('LOCALIZE_ROUTE_PROPERTY');

/**
 * Config interface for LocalizeRouter
 */
export interface LocalizeRouterConfig {
  parser?: Provider;
  cacheName?: string;
  alwaysSetPrefix?: boolean;
  localizeRouteProperty?: boolean;
}

export const LOCALIZE_CACHE_NAME = 'langCode';

export class LocalizeRouterSettings implements LocalizeRouterConfig {
  /**
   * Settings for localize router
   * @param {boolean} alwaysSetPrefix
   * @param {string} cacheName
   * @param {boolean} localizeRouteProperty
   */
  constructor(
    @Inject(ALWAYS_SET_PREFIX) public alwaysSetPrefix: boolean = LOCALIZE_ROUTER_SETTINGS.alwaysSetPrefix || true,
    @Inject(CACHE_NAME) public cacheName: string = LOCALIZE_CACHE_NAME,
    @Inject(LOCALIZE_ROUTE_PROPERTY) public localizeRouteProperty: boolean = LOCALIZE_ROUTER_SETTINGS.localizeRouteProperty || true
  ) {
  }
}
