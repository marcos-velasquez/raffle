import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then((c) => c.LayoutComponent),
    loadChildren: () => import('./context/context.routes').then((c) => c.contextRoutes),
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
