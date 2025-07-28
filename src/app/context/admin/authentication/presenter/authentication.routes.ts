import { Route } from '@angular/router';

export const authenticationRoutes: Route[] = [
  {
    path: '',
    data: { layout: 'empty' },
    loadComponent: () => import('./views/login/login.component').then((c) => c.LoginComponent),
  },
];
