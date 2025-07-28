import { Criteria, is, Operator } from '@shared/domain';

export class CriteriaConverter {
  private readonly operators = new Map<Operator, string>();

  constructor(private readonly criteria: Criteria) {
    this.operators.set(Operator.EQUAL, '=');
    this.operators.set(Operator.NOT_EQUAL, '!=');
    this.operators.set(Operator.GT, '>');
    this.operators.set(Operator.LT, '<');
    this.operators.set(Operator.GTE, '>=');
    this.operators.set(Operator.LTE, '<=');
  }

  public convert(): string {
    return is
      .empty(this.criteria.filters.value)
      .mapRight(() => '')
      .mapLeft(() => {
        return `(
    ${this.criteria.filters.value
      .map((filter) => filter.toPrimitives())
      .map(({ field, operator, value }) => `${field} ${this.operators.get(operator)} ${value}`)
      .join(' && ')}
    )`;
      }).value;
  }
}
