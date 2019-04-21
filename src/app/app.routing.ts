import { Routes, RouterModule, Route } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';

import { WrapperComponent } from '@shared/layouts/wrapper/wrapper.component';

export const routes: Route[] = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full', data: { skipRouteLocalization: true } },
  {
    path: '',
    component: WrapperComponent,
    canActivateChild: [MetaGuard],
    children: [
      { path: '', loadChildren: './home/home.module#HomeModule', data: { skipRouteLocalization: true } },
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
      {
        path: 'not-found',
        loadChildren: './not-found/not-found.module#NotFoundModule',
        data: { skipRouteLocalization: true }
      },
      { path: '**', redirectTo: '/not-found', pathMatch: 'full', data: { skipRouteLocalization: true } },
    ],
  },
];
