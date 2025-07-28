import { Criteria, Filters, Operator } from '@shared/domain';

export class RaffleCriteria extends Criteria {
  private constructor(operator: Operator) {
    super(Filters.fromPrimitives([{ field: 'completed', operator, value: 'true' }]));
  }

  public static available() {
    return new RaffleCriteria(Operator.NOT_EQUAL);
  }
}
