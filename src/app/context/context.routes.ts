import { Route } from '@angular/router';

export const contextRoutes: Route[] = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((c) => c.adminRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./public/public.routes').then((c) => c.publicRoutes),
  },
];
