import { Routes, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import {
  LocalizeRouterSettings,
  CacheMechanism,
  LocalStorage,
  Cookie
} from './localize-router.config';
import { Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ILang } from '@shared/translates';
import { LANG_DEFAULT } from 'app/app-localize-settings';
const COOKIE_EXPIRY = 30; // 1 month

/**
 * Abstract class for parsing localization
 */
export abstract class LocalizeParser {
  locales: Array<ILang>;
  currentLang: string;
  routes: Routes;
  defaultLang: string;

  protected prefix: string;

  private translationObject: any;
  private wildcardRoute: Route;
  private languageRoute: Route;

  /**
   * Loader constructor
   */
  constructor(
    @Inject(TranslateService) private translate: TranslateService,
    @Inject(Location) private location: Location,
    @Inject(LocalizeRouterSettings) private settings: LocalizeRouterSettings
  ) { }

  /**
   * Load routes and fetch necessary data
   */
  abstract load(routes: Routes): Promise<any>;

  /**
   * Initialize language and routes
   */
  protected init(routes: Routes): Promise<any> {
    this.routes = routes;
    if (!this.locales || !this.locales.length) {
      return Promise.resolve();
    }
    const locationLang = this.getLocationLang();

    this.currentLang = locationLang || this._cachedLang || LANG_DEFAULT.code;
    this.defaultLang = LANG_DEFAULT.code;

    const selectedLanguage = this.currentLang || this.defaultLang;
    this.checkRoutes(routes);
    /** translate routes */
    return this.translateRoutes(selectedLanguage).toPromise();
  }

  initChildRoutes(routes: Routes) {
    this._translateRouteTree(routes);
    return routes;
  }

  checkRoutes(routes: Routes) {
    let children: Routes = [];
    /** if set prefix is enforced */
    if (this.settings.alwaysSetPrefix) {
      const baseRoute = {
        path: '',
        redirectTo: this.currentLang,
        pathMatch: 'full'
      };
      /** extract potential wildcard route */
      const wildcardIndex = routes.findIndex(
        (route: Route) => route.path === '**'
      );
      if (wildcardIndex !== -1) {
        
        this.wildcardRoute = routes.splice(wildcardIndex, 1)[0];
        console.log(this.wildcardRoute);
      }
      children = this.routes.splice(0, this.routes.length,baseRoute);
    } else {
      children = this.routes.splice(0, this.routes.length);
    }

    /** exclude certain routes */
    for (let i = children.length - 1; i >= 0; i--) {
      if (children[i].data && children[i].data.skipRouteLocalization) {
        this.routes.push(children[i]);
        children.splice(i, 1);
      }
    }
    /** append children routes */
    if (children && children.length) {
      if (this.locales.length > 1 || this.settings.alwaysSetPrefix) {
        this.languageRoute = { children };
        this.routes.unshift(this.languageRoute);
      } else {
        this.routes.unshift(...children);
      }
    }
    /** ...and potential wildcard route */
    if (this.wildcardRoute && this.settings.alwaysSetPrefix) {
      this.routes.push(this.wildcardRoute);
    }
  }
  mutateRouterRootRoute(
    currentLanguage: string,
    previousLanguage: string,
    routes: Routes
  ) {
    const previousTranslatedLanguage =
      this.settings.alwaysSetPrefix || previousLanguage !== this.defaultLang
        ? previousLanguage
        : '';
    const currentTranslatedLanguage =
      this.settings.alwaysSetPrefix || currentLanguage !== this.defaultLang
        ? currentLanguage
        : '';
    const baseRoute = routes.find(
      route => route.path === previousTranslatedLanguage
    );
    if (baseRoute) {
      baseRoute.path = currentTranslatedLanguage;
    }
  }

  /**
   * Translate routes to selected language
   */
  translateRoutes(language: string): Observable<any> {
    this.setRootLanguage(language);
    return this.translate.use(language).pipe(
      map(translations => {
        this.translationObject = translations;
        this.currentLang = language;
        this.updateRedirectRoute(this.routes);
        if (this.languageRoute) {
          this._translateRouteTree(this.languageRoute.children);

          // if there is wildcard route
          if (this.wildcardRoute && this.wildcardRoute.redirectTo) {
            this._translateProperty(this.wildcardRoute, 'redirectTo', true);
          }
        } else {
          this._translateRouteTree(this.routes);
        }
      })
    );
  }

  // need test
  private updateRedirectRoute(routes) {
    if (this.settings.alwaysSetPrefix) {
      const index = this.routes.findIndex(item => item.path === '' && item.pathMatch === 'full');
      if (index !== -1) {
        routes[index].redirectTo = this.currentLang;
      }
    }
    console.log(this.routes)
  }

  private setRootLanguage(language: string) {
    this._cachedLang = language;
    if (this.languageRoute) {
      this.languageRoute.path =
        this.settings.alwaysSetPrefix || language !== this.defaultLang
          ? language
          : '';
    }
    this.translate.use(language);
  }

  /**
   * Translate the route node and recursively call for all it's children
   */
  private _translateRouteTree(routes: Routes): void {
    routes.forEach((route: Route) => {
      if (route.path && route.path !== '**') {
        this._translateProperty(route, 'path');
      }
      if (route.redirectTo) {
        this._translateProperty(
          route,
          'redirectTo',
          !route.redirectTo.indexOf('/')
        );
      }
      if (route.children) {
        this._translateRouteTree(route.children);
      }
      if (route.loadChildren && (route as any)._loadedConfig) {
        this._translateRouteTree((route as any)._loadedConfig.routes);
      }
    });
  }

  /**
   * Translate property
   * If first time translation then add original to route data object
   */
  private _translateProperty(
    route: Route,
    property: string,
    prefixLang?: boolean
  ): void {
    // set property to data if not there yet
    const routeData: any = (route.data = route.data || {});
    if (!routeData.localizeRouter) {
      routeData.localizeRouter = {};
    }
    if (!routeData.localizeRouter[property]) {
      routeData.localizeRouter[property] = (route as any)[property];
    }
    const result = this.translateRoute(routeData.localizeRouter[property]);
    (route as any)[property] = prefixLang
      ? `/${this.urlPrefix}${result}`
      : result;
  }

  get urlPrefix() {
    return this.settings.alwaysSetPrefix ||
      this.currentLang !== this.defaultLang
      ? this.currentLang
      : '';
  }

  /**
   * Translate route and return observable
   */
  translateRoute(path: string): string {
    const queryParts = path.split('?');
    if (queryParts.length > 2) {
      throw new Error(
        'There should be only one query parameter block in the URL'
      );
    }
    const pathSegments = queryParts[0].split('/');
    if (this.settings.skipLocalizeRoute) {
      /** collect observables  */
      return (
        pathSegments
          .map((part: string) =>
            part.length ? this.translateText(part) : part
          )
          .join('/') + (queryParts.length > 1 ? `?${queryParts[1]}` : '')
      );
    } else {
      return (
        pathSegments.join('/') +
        (queryParts.length > 1 ? `?${queryParts[1]}` : '')
      );
    }
  }

  /**
   * Get language from url
   */
  getLocationLang(url?: string): string {
    const pathSlices = (url || this.location.path() || '')
      .split('#')[0]
      .split('?')[0]
      // need test
      .split('(')[0]
      .split('/');
    if (pathSlices.length > 1) {
      if (this.locales.map(x => x.code).indexOf(pathSlices[1]) !== -1) {
        return pathSlices[1];
      }
    }
    if (
      pathSlices.length &&
      this.locales.map(x => x.code).indexOf(pathSlices[0]) !== -1
    ) {
      return pathSlices[0];
    }
    return null;
  }
  /**
   * Get translated value
   */
  private translateText(key: string): string {
    if (!this.translationObject) {
      return key;
    }
    const prefixedKey = this.prefix + key;
    const res = this.translate.getParsedResult(
      this.translationObject,
      prefixedKey
    );
    // ignore non-translated text like 'ROUTES.home'
    if (res === prefixedKey) {
      return key;
    }
    return res || key;
  }
  /**
   * Get language from local storage or cookie
   */
  private get _cachedLang(): string {
    if (!this.settings.useCachedLang) {
      return;
    }
    if (this.settings.cacheMechanism === LocalStorage) {
      return this._cacheWithLocalStorage();
    }
    if (this.settings.cacheMechanism === Cookie) {
      return this._cacheWithCookies();
    }
  }

  /**
   * Save language to local storage or cookie
   */
  private set _cachedLang(value: string) {
    if (!this.settings.useCachedLang) {
      return;
    }
    if (this.settings.cacheMechanism === LocalStorage) {
      this._cacheWithLocalStorage(value);
    }
    if (this.settings.cacheMechanism === Cookie) {
      this._cacheWithCookies(value);
    }
  }

  /**
   * Cache value to local storage
   */
  private _cacheWithLocalStorage(value?: string): string {
    if (
      typeof window === 'undefined' ||
      typeof window.localStorage === 'undefined'
    ) {
      return;
    }
    try {
      if (value) {
        window.localStorage.setItem(this.settings.cacheName, value);
        return;
      }
      return this._returnIfInLocales(
        window.localStorage.getItem(this.settings.cacheName)
      );
    } catch (e) {
      // weird Safari issue in private mode, where LocalStorage is defined but throws error on access
      return;
    }
  }

  /**
   * Cache value via cookies
   */
  private _cacheWithCookies(value?: string): string {
    if (
      typeof document === 'undefined' ||
      typeof document.cookie === 'undefined'
    ) {
      return;
    }
    try {
      const name = encodeURIComponent(this.settings.cacheName);
      if (value) {
        const d: Date = new Date();
        d.setTime(d.getTime() + COOKIE_EXPIRY * 86400000); // * days
        document.cookie = `${name}=${encodeURIComponent(
          value
        )};expires=${d.toUTCString()}`;
        return;
      }
      const regexp = new RegExp(
        '(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)',
        'g'
      );
      const result = regexp.exec(document.cookie);
      return decodeURIComponent(result[1]);
    } catch (e) {
      return; // should not happen but better safe than sorry
    }
  }
  private _returnIfInLocales(value: string): string {
    if (value && this.locales.some(l => l.code === value)) {
      return value;
    }
    return null;
  }
}

/**
 * Manually set configuration
 */
export class ManualParserLoader extends LocalizeParser {
  /**
   * CTOR
   */
  constructor(
    translate: TranslateService,
    location: Location,
    settings: LocalizeRouterSettings,
    locales: ILang[] = [{ code: 'en', name: 'English', culture: 'en-US' }],
    prefix: string = 'ROUTES.'
  ) {
    super(translate, location, settings);
    this.locales = locales;
    this.prefix = prefix || '';
  }

  /**
   * Initialize or append routes
   */
  load(routes: Routes): Promise<any> {
    return new Promise((resolve: any) => {
      this.init(routes).then(resolve);
    });
  }
}

export class DummyLocalizeParser extends LocalizeParser {
  load(routes: Routes): Promise<any> {
    return new Promise((resolve: any) => {
      this.init(routes).then(resolve);
    });
  }
}
