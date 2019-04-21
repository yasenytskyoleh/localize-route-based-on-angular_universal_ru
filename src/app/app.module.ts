// angular
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import { routes } from './app.routing';
// libs
import { CookieService, CookieModule } from '@gorniv/ngx-universal';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { TranslateService } from '@ngx-translate/core';
// shared
import { SharedModule } from '@shared/shared.module';
import { TranslatesService, ILang } from '@shared/translates';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { LocalizeRouterModule } from './shared/localize-router/localize-router.module';
import { LocalizeParser, ManualParserLoader } from './shared/localize-router/localize-router.parser';

// components
import { AppComponent } from './app.component';


//config
import { LOCALIZE_ROUTER_SETTINGS, LANG_LIST, LOCALIZE_ROUTER_PREFIX } from './app-localize-settings';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { initialNavigation: true }),
    LocalizeRouterModule.forRoot(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: (translate, translates: TranslatesService, location: Location) =>
          new ManualParserLoader(translate, translates, location, LOCALIZE_ROUTER_SETTINGS, LANG_LIST, LOCALIZE_ROUTER_PREFIX),
        deps: [TranslateService, TranslatesService, Location, HttpClient]
      }
    }),
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    SharedModule.forRoot(),
  ],
  declarations: [AppComponent],
  providers: [
    CookieService,
    UniversalStorage
  ],
})
export class AppModule { }
