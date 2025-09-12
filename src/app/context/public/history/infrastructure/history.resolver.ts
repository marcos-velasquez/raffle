import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { when } from '@shared/domain';
import { History } from '@context/shared/domain';
import { HistoryStore } from './history.store';

export const historyResolver: ResolveFn<History> = (route) => {
  return when(route.paramMap.get('id')).map((id) => inject(HistoryStore).get(id)).value as History;
};
