import {
  NgModule, ModuleWithProviders, APP_INITIALIZER, Optional, SkipSelf,
  Injectable, Injector, NgModuleFactory
} from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { DummyLocalizeParser, LocalizeParser } from './localize-router.parser';
import { RouterModule, Routes } from '@angular/router';
import { LocalizeRouterPipe } from './localize-router.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
   LOCALIZE_ROUTER_FORROOT_GUARD, LocalizeRouterConfig, LocalizeRouterSettings,
  RAW_ROUTES,
  ALWAYS_SET_PREFIX,
  CACHE_NAME,
  LOCALIZE_ROUTE_PROPERTY,
  USE_CACHED_LANG,
  CACHE_MECHANISM,
} from './localize-router.config';
import { LocalizeRouterConfigLoader } from './localize-router-config-loader';

@Injectable()
export class ParserInitializer {
  parser: LocalizeParser;
  routes: Routes;

  /**
   * CTOR
   */
  constructor(private injector: Injector) {
  }

  /**
   */
  appInitializer(): Promise<any> {
    const res = this.parser.load(this.routes);
    res.then(() => {
      const localize: LocalizeRouterService = this.injector.get(LocalizeRouterService);
      localize.init();
    });

    return res;
  }

  generateInitializer(parser: LocalizeParser, routes: Routes[]): () => Promise<any> {
    this.parser = parser;
    this.routes = routes.reduce((a, b) => a.concat(b));
    return this.appInitializer;
  }
}

export function getAppInitializer(p: ParserInitializer, parser: LocalizeParser, routes: Routes[]): any {
  return p.generateInitializer(parser, routes).bind(p);
}

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule],
  declarations: [LocalizeRouterPipe],
  exports: [LocalizeRouterPipe]
})
export class LocalizeRouterModule {

  static forRoot(routes: Routes, config: LocalizeRouterConfig = {}): ModuleWithProviders {
    return {
      ngModule: LocalizeRouterModule,
      providers: [
        {
          provide: LOCALIZE_ROUTER_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[LocalizeRouterModule, new Optional(), new SkipSelf()]]
        },
        { provide: ALWAYS_SET_PREFIX, useValue: config.alwaysSetPrefix },
        { provide: CACHE_NAME, useValue: config.cacheName },
        { provide: LOCALIZE_ROUTE_PROPERTY, useValue: config.skipLocalizeRoute },
        { provide: USE_CACHED_LANG, useValue: config.useCachedLang },
        { provide: CACHE_MECHANISM, useValue: config.cacheMechanism },
        LocalizeRouterSettings,
        config.parser || { provide: LocalizeParser, useClass: DummyLocalizeParser },
        {
          provide: RAW_ROUTES,
          multi: true,
          useValue: routes
        },
        LocalizeRouterService,
        ParserInitializer,
        {  provide: NgModuleFactory, useClass: LocalizeRouterConfigLoader },
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: getAppInitializer,
          deps: [ParserInitializer, LocalizeParser, RAW_ROUTES]
        }
      ]
    };
  }

  static forChild(routes: Routes): ModuleWithProviders {
    return {
      ngModule: LocalizeRouterModule,
      providers: [
        {
          provide: RAW_ROUTES,
          multi: true,
          useValue: routes
        }
      ]
    };
  }
}

/**
 */
export function provideForRootGuard(localizeRouterModule: LocalizeRouterModule): string {
  if (localizeRouterModule) {
    throw new Error(
      `LocalizeRouterModule.forRoot() called twice. Lazy loaded modules should use LocalizeRouterModule.forChild() instead.`);
  }
  return 'guarded';
}
