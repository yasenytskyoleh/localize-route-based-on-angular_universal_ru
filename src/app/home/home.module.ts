import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { HomeRoutes, HomeLocalizeRoutes } from './home.routing';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [CommonModule, HomeRoutes, TranslateModule, HomeLocalizeRoutes],
  declarations: [HomeComponent],
})
export class HomeModule {}
