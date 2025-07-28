import { Route } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from './authentication/infrastructure';
import { redirectRaffleNotFoundTo } from './raffle/infrastructure/raffle.guard';
import { raffleResolver } from './raffle/infrastructure/raffle.resolver';

export const adminRoutes: Route[] = [
  {
    path: 'authentication',
    ...canActivate(() => redirectLoggedInTo(['admin/raffle'])),
    loadChildren: () => import('./authentication/presenter/authentication.routes').then((c) => c.authenticationRoutes),
  },
  {
    path: '',
    ...canActivate(() => redirectUnauthorizedTo(['admin/authentication'])),
    children: [
      {
        path: 'raffle/:id',
        canActivate: [redirectRaffleNotFoundTo('admin/raffle')],
        resolve: { raffle: raffleResolver },
        loadComponent: () =>
          import('./number/presenter/views/number-list/number-list.component').then((c) => c.NumberListComponent),
      },
      {
        path: 'raffle/:id/numbers/:value',
        canActivate: [redirectRaffleNotFoundTo('admin/raffle')],
        resolve: { raffle: raffleResolver },
        loadComponent: () =>
          import('./number/presenter/views/number-editor/number-editor.component').then((c) => c.NumberEditorComponent),
      },
      {
        path: 'raffle/:id/roulette',
        canActivate: [redirectRaffleNotFoundTo('admin/raffle')],
        resolve: { raffle: raffleResolver },
        loadComponent: () =>
          import('./roulette/presenter/views/roulette/roulette.component').then((c) => c.RouletteComponent),
      },
      {
        path: 'raffle',
        loadComponent: () =>
          import('./raffle/presenter/views/raffle-list/raffle-list.component').then((c) => c.RaffleListComponent),
      },
    ],
  },
];
