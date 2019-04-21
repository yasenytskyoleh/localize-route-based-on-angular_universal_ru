// angular
import { NgModule } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
// libs
import { REQUEST } from '@nguniversal/express-engine/tokens';
// shared
import { TranslatesBrowserModule } from '@shared/translates/translates-browser';
// components
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InlineStyleModule } from './inline-style/inline-style.module';
import { InlineStyleComponent } from './inline-style/inline-style.component';
import { StateTransferInitializerModule } from '@nguniversal/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalizeRouterModule } from './shared/localize-router/localize-router.module';
import { LocalizeParser, ManualParserLoader } from './shared/localize-router/localize-router.parser';
import { LocalizeLanguageService } from './shared/localize-router/localize-language';
import { LocalizeRouterSettings } from './shared/localize-router/localize-router.config';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { routes } from './app.routing';
import { RouterModule } from '@angular/router';
// import { ServiceWorkerModule } from '@angular/service-worker';

// the Request object only lives on the server
export function getRequest(): any {
  return { headers: { cookie: document.cookie } };
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
@NgModule({
  bootstrap: [AppComponent, InlineStyleComponent],
  imports: [
    AppModule,
    StateTransferInitializerModule,
    BrowserTransferStateModule,
    // TranslatesBrowserModule,
    RouterModule.forRoot(routes),
    InlineStyleModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: false }),
  ],
  providers: [
    {
      // The server provides these in main.server
      provide: REQUEST,
      useFactory: getRequest,
    },
    { provide: 'ORIGIN_URL', useValue: location.origin },
  ],
})
export class AppBrowserModule {}
