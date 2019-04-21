import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';

import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TRANSLATES_CONFIG } from '../../../app-localize-settings';

const fs = require('fs');

export class TranslatesServerLoaderService implements TranslateLoader {
  constructor(
    private prefix: string = TRANSLATES_CONFIG.prefix,
    private suffix: string = TRANSLATES_CONFIG.fileType,
    private transferState: TransferState,
  ) {}

  public getTranslation(lang: string): Observable<any> {
    return Observable.create((observer) => {
      const jsonData: any = JSON.parse(
        fs.readFileSync(`${this.prefix}/${lang}${this.suffix}`, 'utf8'),
      );
      const key: StateKey<number> = makeStateKey<number>(`transfer-translate-${lang}`);
      this.transferState.set(key, jsonData);
      observer.next(jsonData);
      observer.complete();
    });
  }
}
