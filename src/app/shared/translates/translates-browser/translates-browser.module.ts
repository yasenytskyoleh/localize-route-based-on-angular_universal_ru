import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransferState } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule, MissingTranslationHandler } from '@ngx-translate/core';

import {
  TranslatesService,
  CommonMissingTranslationHandler,
} from '@shared/translates/translates.service';

import { TranslatesBrowserLoaderService } from './translates-browser-loader.service';
import { TRANSLATES_CONFIG } from '../../../app-localize-settings';

export function translateStaticLoader(
  http: HttpClient,
  transferState: TransferState,
): TranslatesBrowserLoaderService {
  return new TranslatesBrowserLoaderService(TRANSLATES_CONFIG.csrPath, TRANSLATES_CONFIG.fileType, transferState, http);
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: CommonMissingTranslationHandler,
      },
      loader: {
        provide: TranslateLoader,
        useFactory: translateStaticLoader,
        deps: [HttpClient, TransferState],
      },
    }),
  ],
  providers: [TranslatesService],
})
export class TranslatesBrowserModule { }
