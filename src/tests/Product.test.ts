import { Product } from '../Product';
import { getStartOfWeekDate } from '../utils';

function getPotentialDeliveryDays(maxDeliveryDays: number, startDate?: Date): Date[] {
  let dateOfTomorrow = new Date();
  dateOfTomorrow.setDate(new Date().getDate() + 1);
  let dates: Date[] = [startDate ? new Date(startDate) : dateOfTomorrow];
  for (let i = 0; i < maxDeliveryDays - 1; i++) {
    let tempDate = new Date();
    tempDate.setDate(dates[i].getDate() + 1);
    dates.push(tempDate);
  }
  return dates;
}

describe('Test getDeliveryRestrictions', () => {
  test('Test normal product, delivered on Mon to Fri, 2 days in advance', () => {
    const product: Product = new Product('001', 'testProduct', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], 'normal', 2);
    let dates: Date[] = getPotentialDeliveryDays(14, new Date('2022-10-04'));

    //daysInAdvance: 2
    //weekDays: 7
    //Total 7?
    expect(product.getDeliveryRestrictions(dates)).toHaveLength(8);
  });
});

describe('Test getDeliveryRestrictionsDaysInAdvance', () => {
  test('If daysInAdvance is set to 4, the 4 coming days + today should be returned as restricted', () => {
    const product: Product = new Product('001', 'testProduct', ['Mon'], 'external', 4);
    let dates: Date[] = getPotentialDeliveryDays(14);
    expect(product.getDeliveryRestrictionsDaysInAdvance(dates)).toHaveLength(4);
  });
});

describe('Test getDeliveryRestrictionsDeliveryDays', () => {
  test('If product can be delivered on all days except saturday and sundays, all dates where the weekday is not saturday or sunday should be returned', () => {
    const product: Product = new Product('001', 'testProduct', ['Sat', 'Sun'], 'external', 4);
    let dates: Date[] = getPotentialDeliveryDays(7);

    const deliveryDateRestrictions: Date[] = product.getDeliveryRestrictionsDeliveryDays(dates);
    expect(deliveryDateRestrictions).toHaveLength(5);

    //Since day 6 is saturday, we check to verify that all days are less than 6.
    for (const deliveryRestriction of deliveryDateRestrictions) {
      expect(deliveryRestriction.getDay()).toBeLessThan(6);
    }
  });
});

describe('Test getDeliveryRestrictionsExternalProduct', () => {
  test('If a product is external, all dates 5 days from now should be returned as restricted dates.', () => {
    const product: Product = new Product('001', 'testProduct', ['Sat', 'Sun'], 'external', 4);
    let dates: Date[] = getPotentialDeliveryDays(10);

    const deliveryDateRestrictions: Date[] = product.getDeliveryRestrictionsExternalProduct(dates);
    expect(deliveryDateRestrictions).toHaveLength(dates.length - 5);
  });
});

describe('Test getDeliveryRestrictionsTemporaryProduct', () => {
  test('Only days outside of the current week should be returned as restricted days', () => {
    const product: Product = new Product('001', 'testProduct', ['Sat', 'Sun'], 'temporary', 4);
    let dates: Date[] = getPotentialDeliveryDays(10, new Date('2022-10-06'));

    const deliveryDateRestrictions: Date[] = product.getDeliveryRestrictionsTemporaryProduct(dates);
    expect(deliveryDateRestrictions).toHaveLength(6);
  });
});
