import { Route } from '@angular/router';
import { redirectRaffleNotFoundTo } from './raffle/infrastructure';
import { redirectHistoryNotFoundTo } from './history/infrastructure';

export const publicRoutes: Route[] = [
  {
    path: '',
    data: { layout: 'basic' },
    children: [
      {
        path: 'raffle/:raffleId/numbers/:value',
        canActivate: [redirectRaffleNotFoundTo('')],
        loadComponent: () =>
          import('./number/presenter/views/number-buyer/number-buyer.component').then((c) => c.NumberBuyerComponent),
      },
      {
        path: 'raffle/:raffleId',
        canActivate: [redirectRaffleNotFoundTo('')],
        loadComponent: () =>
          import('./number/presenter/views/number-list/number-list.component').then((c) => c.NumberListComponent),
      },
      {
        path: 'history/:historyId',
        canActivate: [redirectHistoryNotFoundTo('/history')],
        loadComponent: () =>
          import('./history/presenter/views/history/history.component').then((c) => c.HistoryComponent),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./history/presenter/views/history-list/history-list.component').then((c) => c.HistoryListComponent),
      },
      {
        path: '',
        loadComponent: () =>
          import('./raffle/presenter/views/raffle-list/raffle-list.component').then((c) => c.RaffleListComponent),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];
