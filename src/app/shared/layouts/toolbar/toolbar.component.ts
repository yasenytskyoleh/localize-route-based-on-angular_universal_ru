import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TranslatesService, ILang } from '@shared/translates';
import { LocalizeRouterService } from '../../localize-router/localize-router.service';
import { LANG_LIST } from '../../../app-localize-settings';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {
  public currentLang: string;
  public langList = LANG_LIST;
  constructor(
    private _translatesService: TranslatesService,
    private localize: LocalizeRouterService
    ) {}

  ngOnInit(): void {
    this.currentLang = this._translatesService.getCurrentLang();
  }

  changeLanguage(lang: string) {
    this.localize.changeLanguage(lang);
  }
}
