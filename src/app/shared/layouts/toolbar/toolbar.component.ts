import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TranslatesService, ILang } from '@shared/translates';
import { LocalizeLanguageService } from '../../localize-router/localize-language';
import { LocalizeRouterService } from '../../localize-router/localize-router.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {
  public langList$: Observable<ILang[]>;
  public currentLang: string;

  constructor(
    // private _translatesService: TranslatesService
    // private localize: LocalizeLanguageService
    private localize: LocalizeRouterService
    ) {}

  ngOnInit(): void {
    // this.langList$ = this._translatesService.getLangList();
    // this.currentLang = this._translatesService.getCurrentLang();
  }

  changeLanguage(lang: string) {
    this.localize.changeLanguage(lang);
  }
}
