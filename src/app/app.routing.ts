import { Routes, RouterModule } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';

import { WrapperComponent } from '@shared/layouts/wrapper/wrapper.component';

export const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    component: WrapperComponent,
    canActivateChild: [MetaGuard],
    children: [
      { path: '', loadChildren: './home/home.module#HomeModule' },
      {
        path: 'mock',
        loadChildren: './mock-server-browser/mock-server-browser.module#MockServerBrowserModule',
      },
      { path: 'back', loadChildren: './transfer-back/transfer-back.module#TransferBackModule' },
      {
        path: 'static/back',
        loadChildren: './transfer-back/transfer-back.module#TransferBackModule',
      },
      { path: 'async', loadChildren: './http-async/http-async.module#HttpAsyncModule' },
      { path: '**', loadChildren: './not-found/not-found.module#NotFoundModule' },
    ],
  },
];
// must use {initialNavigation: 'enabled'}) - for one load page, without reload
export const AppRoutes = RouterModule.forRoot(routes, { initialNavigation: 'enabled' });
