import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { LocalizeRouterModule } from '../localize-router/localize-router.module';

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule, LocalizeRouterModule],
  declarations: [FooterComponent, SidebarComponent, ToolbarComponent, WrapperComponent],
})
export class LayoutsModule {}
