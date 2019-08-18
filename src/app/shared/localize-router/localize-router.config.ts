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
    @Inject(LOCALIZE_ROUTER_SETTINGS.alwaysSetPrefix) public alwaysSetPrefix: boolean = true,
    @Inject(LOCALIZE_ROUTER_SETTINGS.cacheName) public cacheName: string = LOCALIZE_CACHE_NAME,
    @Inject(LOCALIZE_ROUTER_SETTINGS.localizeRouteProperty) public localizeRouteProperty: boolean = true
  ) {
  }
}
