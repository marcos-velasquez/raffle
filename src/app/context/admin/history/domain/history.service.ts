import { E } from '@shared/domain';
import { Exception } from '@shared/domain';
import { History } from '../domain';

export interface HistoryService {
  save(history: History): Promise<E.Either<Exception, History>>;
}
