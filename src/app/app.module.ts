// angular
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// libs
import { CookieService, CookieModule } from '@gorniv/ngx-universal';
import { TransferHttpCacheModule } from '@nguniversal/common';
// shared
import { SharedModule } from '@shared/shared.module';
import { TranslatesService } from '@shared/translates';
// components
import { AppRoutes, routes } from './app.routing';
import { AppComponent } from './app.component';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { LocalizeRouterModule } from './shared/localize-router/localize-router.module';
import { LocalizeParser, ManualParserLoader } from './shared/localize-router/localize-router.parser';
import { LocalizeRouterSettings } from './shared/localize-router/localize-router.config';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Location } from '@angular/common';
import { environment } from '../environments/browser/environment.prod';
import { LocalizeLanguageService } from './shared/localize-router/localize-language';

export function initLanguage(translateService: TranslatesService): Function {
  return (): Promise<any> => translateService.initLanguage();
}

export function HttpLoaderFactory(http: HttpClient) {
  console.log(environment.isServer + "asdf")
  return environment.isServer ? new TranslateHttpLoader(http, './dist/assets/i18n/', '.json') : new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LocalizeRouterModule.forRoot(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: (translate, localizeLanguage: LocalizeLanguageService, location: Location, settingsLocalize: LocalizeRouterSettings) =>
          new ManualParserLoader(translate, localizeLanguage, location, settingsLocalize, ['en', 'ru'], 'ROUTES.'),
        deps: [TranslatesService, LocalizeLanguageService, Location, LocalizeRouterSettings, HttpClient]
      }
    }),
    // AppRoutes,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    SharedModule.forRoot(),
  ],
  declarations: [AppComponent],
  providers: [
    CookieService,
    UniversalStorage,
    // { provide: APP_INITIALIZER, useFactory: initLanguage, multi: true, deps: [TranslatesService] },
  ],
})
export class AppModule { }
