import { HttpClient } from '@angular/common/http';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';

import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';
import { TRANSLATES_CONFIG } from '../../../app-localize-settings';

export class TranslatesBrowserLoaderService implements TranslateLoader {
  constructor(
    private prefix: string = TRANSLATES_CONFIG.prefix,
    private suffix: string = TRANSLATES_CONFIG.fileType,
    private transferState: TransferState,
    private http: HttpClient,
  ) {}

  public getTranslation(lang: string): Observable<any> {
    const key: StateKey<number> = makeStateKey<number>(`transfer-translate-${lang}`);
    const data: any = this.transferState.get(key, null);
    if (data) {
      return Observable.create((observer) => {
        observer.next(data);
        observer.complete();
      });
    } else {
      return new TranslateHttpLoader(this.http, this.prefix, this.suffix).getTranslation(lang);
    }
  }
}
