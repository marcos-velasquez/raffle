import { CriteriaConverter } from '../criteria.converter';
import { Criteria } from '@shared/domain/criteria/Criteria';
import { Operator } from '@shared/domain/criteria/FilterOperator';

class MockFilter {
  constructor(public field: string, public operator: Operator, public value: string | number) {}
  toPrimitives() {
    return { field: this.field, operator: this.operator, value: this.value };
  }
}
class MockFilters {
  constructor(public value: MockFilter[]) {}
}

describe('CriteriaConverter', () => {
  it('should return empty string if no filters', () => {
    const criteria = { filters: new MockFilters([]) } as unknown as Criteria;
    const converter = new CriteriaConverter(criteria);
    expect(converter.convert()).toBe('');
  });

  it('should convert single filter', () => {
    const filters = [new MockFilter('age', Operator.GT, 18)];
    const criteria = { filters: new MockFilters(filters) } as unknown as Criteria;
    const converter = new CriteriaConverter(criteria);
    expect(converter.convert().replace(/\s+/g, '')).toBe('(age>18)'.replace(/\s+/g, ''));
  });

  it('should convert multiple filters', () => {
    const filters = [new MockFilter('age', Operator.GT, 18), new MockFilter('name', Operator.EQUAL, 'John')];
    const criteria = { filters: new MockFilters(filters) } as unknown as Criteria;
    const converter = new CriteriaConverter(criteria);
    expect(converter.convert().replace(/\s+/g, '')).toBe('(age>18&&name=John)'.replace(/\s+/g, ''));
  });

  it('should use correct operators', () => {
    const filters = [
      new MockFilter('x', Operator.LT, 10),
      new MockFilter('y', Operator.LTE, 5),
      new MockFilter('z', Operator.GTE, 7),
      new MockFilter('a', Operator.NOT_EQUAL, 0),
    ];
    const criteria = { filters: new MockFilters(filters) } as unknown as Criteria;
    const converter = new CriteriaConverter(criteria);
    expect(converter.convert().replace(/\s+/g, '')).toBe('(x<10&&y<=5&&z>=7&&a!=0)'.replace(/\s+/g, ''));
  });
});
