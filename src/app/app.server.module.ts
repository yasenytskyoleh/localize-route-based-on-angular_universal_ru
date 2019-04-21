// angular
import { NgModule, ViewEncapsulation, Component } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// libs
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
// shared
import { TranslatesServerModule } from '@shared/translates/translates-server';
// components
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { InlineStyleComponent } from './inline-style/inline-style.component';
import { InlineStyleModule } from './inline-style/inline-style.module';
import { CookieService, CookieBackendService, CookieModule } from '@gorniv/ngx-universal';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterModule } from './shared/localize-router/localize-router.module';
import { LocalizeParser, ManualParserLoader } from './shared/localize-router/localize-router.parser';
import { LocalizeRouterSettings } from './shared/localize-router/localize-router.config';
import { Location } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './dist/assets/i18n/', '.json');
}

@NgModule({
  imports: [
    // AppModule - FIRST!!!
    AppModule,
    ServerModule,

    NoopAnimationsModule,
    ServerTransferStateModule,
    InlineStyleModule,
    ModuleMapLoaderModule,
    // TranslatesServerModule,
 
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // }),
    // LocalizeRouterModule.forRoot(routes, {
    //   parser: {
    //     provide: LocalizeParser,
    //     useFactory: (translate, location: Location, settingsLocalize: LocalizeRouterSettings) =>
    //       new ManualParserLoader(translate, location, settingsLocalize, ['en', 'ru'], 'ROUTES.'),
    //     deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient]
    //   }
    // }),
  ],
  bootstrap: [AppComponent, InlineStyleComponent],
  providers: [
    { provide: CookieService, useClass: CookieBackendService },
  ],
})
export class AppServerModule {}
