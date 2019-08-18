import { Routes, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { LocalizeRouterSettings } from './localize-router.config';
import { Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ILang, TranslatesService } from '../translates';
import { LANG_LIST, LANG_DEFAULT } from '../../app-localize-settings';

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

  private _translationObject: any;
  private _wildcardRoute: Route;
  private _languageRoute: Route;

  /**
   * Loader constructor
   * @param translate
   * @param location
   * @param settings
   */
  constructor(
    @Inject(TranslateService) private translate: TranslateService,
    @Inject(TranslatesService) private translates: TranslatesService,
    @Inject(Location) private location: Location,
    @Inject(LocalizeRouterSettings) private settings: LocalizeRouterSettings,

  ) {
  }

  /**
   * Load routes and fetch necessary data
   * @param routes
   * @returns {Promise<any>}
   */
  abstract load(routes: Routes): Promise<any>;

  /**
   * Initialize language and routes
   * @param routes
   * @returns {Promise<any>}
   */
  protected init(routes: Routes): Promise<any> {
    this.routes = routes;
    if (!this.locales || !this.locales.length) {
      return Promise.resolve();
    }
    const locationLang = this.getLocationLang();

    const browserLang = this.translates._getLanguage();
    this.currentLang = locationLang || browserLang.code || this.locales[0].code;
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
      const baseRoute = { path: '', redirectTo: this.currentLang, pathMatch: 'full' };
      /** extract potential wildcard route */
      const wildcardIndex = routes.findIndex((route: Route) => route.path === '**');
      if (wildcardIndex !== -1) {
        this._wildcardRoute = routes.splice(wildcardIndex, 1)[0];
      }
      children = this.routes.splice(0, this.routes.length, baseRoute);
    } else {
      children = this.routes.splice(0, this.routes.length);
    }

    /** exclude certain routes */
    for (let i = children.length - 1; i >= 0; i--) {
      if (children[i].data && children[i].data['skipRouteLocalization']) {
        this.routes.push(children[i]);
        children.splice(i, 1);

      }
    }
    /** append children routes */
    if (children && children.length) {
      if (this.locales.length > 1 || this.settings.alwaysSetPrefix) {
        this._languageRoute = { children: children };
        this.routes.unshift(this._languageRoute);
      } else {
        this.routes.unshift(...children);
      }
    }

    /** ...and potential wildcard route */
    if (this._wildcardRoute && this.settings.alwaysSetPrefix) {

      this.routes.push(this._wildcardRoute);
    }
  }
  mutateRouterRootRoute(currentLanguage: string, previousLanguage: string, routes: Routes) {
    const previousTranslatedLanguage = this.settings.alwaysSetPrefix || previousLanguage !== this.defaultLang ?
      previousLanguage : '';
    const currentTranslatedLanguage = this.settings.alwaysSetPrefix || currentLanguage !== this.defaultLang ?
      currentLanguage : '';
    const baseRoute = routes.find(route => route.path === previousTranslatedLanguage);
    if (baseRoute) {
      baseRoute.path = currentTranslatedLanguage;
    }
  }

  /**
   * Translate routes to selected language
   * @param language
   * @returns {Promise<any>}
   */
  translateRoutes(language: string): Observable<any> {
    this.setRootLanguage(language);
    return this.translate.use(language)
      .pipe(
        map(translations => {
          this._translationObject = translations;
          if (this._languageRoute) {
            this._translateRouteTree(this._languageRoute.children);

            // if there is wildcard route
            if (this._wildcardRoute && this._wildcardRoute.redirectTo) {
              this._translateProperty(this._wildcardRoute, 'redirectTo', true);
            }
          } else {

            this._translateRouteTree(this.routes);
          }
        })
      );
  }

  private setRootLanguage(language: string) {
    this.currentLang = language;
    if (this._languageRoute) {
      this._languageRoute.path = this.settings.alwaysSetPrefix || language !== this.defaultLang ?
        language : '';
    }
    this.translates.changeLang(language);
  }

  /**
   * Translate the route node and recursively call for all it's children
   * @param routes
   * @private
   */
  private _translateRouteTree(routes: Routes): void {
    routes.forEach((route: Route) => {
      if (route.path && route.path !== '**') {

        this._translateProperty(route, 'path');
      }
      if (route.redirectTo) {
        this._translateProperty(route, 'redirectTo', !route.redirectTo.indexOf('/'));
      }
      if (route.children) {
        this._translateRouteTree(route.children);
      }
      if (route.loadChildren && (<any>route)._loadedConfig) {
        this._translateRouteTree((<any>route)._loadedConfig.routes);
      }
    });
  }

  /**
   * Translate property
   * If first time translation then add original to route data object
   * @param route
   * @param property
   * @param prefixLang
   * @private
   */
  private _translateProperty(route: Route, property: string, prefixLang?: boolean): void {
    // set property to data if not there yet
    const routeData: any = route.data = route.data || {};
    if (!routeData.localizeRouter) {
      routeData.localizeRouter = {};
    }
    if (!routeData.localizeRouter[property]) {
      routeData.localizeRouter[property] = (<any>route)[property];
    }
    const result = this.translateRoute(routeData.localizeRouter[property]);
    (<any>route)[property] = prefixLang ? `/${this.urlPrefix}${result}` : result;
  }

  get urlPrefix() {
    return this.settings.alwaysSetPrefix || this.currentLang !== this.defaultLang ? this.currentLang : '';
  }

  /**
   * Translate route and return observable
   * @param path
   * @returns {string}
   */
  translateRoute(path: string): string {
    const queryParts = path.split('?');
    if (queryParts.length > 2) {
      throw new Error('There should be only one query parameter block in the URL');
    }
    const pathSegments = queryParts[0].split('/');
    if (this.settings.localizeRouteProperty) {
      /** collect observables  */
      return pathSegments
        .map((part: string) => part.length ? this.translateText(part) : part)
        .join('/') +
        (queryParts.length > 1 ? `?${queryParts[1]}` : '');
    } else {
      return pathSegments
        .join('/') +
        (queryParts.length > 1 ? `?${queryParts[1]}` : '');
    }
  }

  /**
   * Get language from url
   * @returns {string}
   * @private
   */
  getLocationLang(url?: string): string {
    const pathSlices = (url || this.location.path() || '')
      .split('#')[0]
      .split('?')[0]
      .split('/');
    if (pathSlices.length > 1) {
      if (this.locales.map(x => x.code).indexOf(pathSlices[1]) !== -1) {
        return pathSlices[1];
      }
    }
    if (pathSlices.length && this.locales.map(x => x.code).indexOf(pathSlices[0]) !== -1) {
      return pathSlices[0];
    }
    return LANG_DEFAULT.code;
  }
  /**
   * Get translated value
   * @param key
   * @returns {any}
   */
  private translateText(key: string): string {
    if (!this._translationObject) {
      return key;
    }
    const prefixedKey = this.prefix + key;
    const res = this.translate.getParsedResult(this._translationObject, prefixedKey);
    // ignore non-translated text like 'ROUTES.home'
    if (res === prefixedKey) {
      return key;
    }
    return res || key;
  }
}

/**
 * Manually set configuration
 */
export class ManualParserLoader extends LocalizeParser {

  /**
   * CTOR
   * @param translate
   * @param location
   * @param settings
   * @param locales
   * @param prefix
   */
  constructor(
    translate: TranslateService,
    translates: TranslatesService,
    location: Location,
    settings: LocalizeRouterSettings,
    locales: ILang[] = [{ code: 'en', name: 'English', culture: 'en-US' }],
    prefix: string = 'ROUTES.') {
    super(translate, translates, location, settings);
    this.locales = locales;
    this.prefix = prefix || '';
  }

  /**
   * Initialize or append routes
   * @param routes
   * @returns {Promise<any>}
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
