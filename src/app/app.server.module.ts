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
import { CookieService, CookieBackendService } from '@gorniv/ngx-universal';

@NgModule({
  imports: [
    // AppModule - FIRST!!!
    AppModule,
    ServerModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
    InlineStyleModule,
    ModuleMapLoaderModule,
    TranslatesServerModule,
  ],
  bootstrap: [AppComponent, InlineStyleComponent],
  providers: [
    { provide: CookieService, useClass: CookieBackendService },
  ],
})
export class AppServerModule {}
