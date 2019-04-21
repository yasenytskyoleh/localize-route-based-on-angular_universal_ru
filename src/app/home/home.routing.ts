import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from '../shared/localize-router/localize-router.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      meta: {
        title: 'home.title',
        description: 'home.text',
        override: true,
      },
    },
  },
];

export const HomeRoutes = RouterModule.forChild(routes);
export const HomeLocalizeRoutes = LocalizeRouterModule.forChild(routes);
