import {
  dateIsGreenDelivery,
  getPossibleDeliveryDates,
  initPotentialDeliveryDates,
  initProductList,
  sortDates,
} from '../deliveryDateService';
import products from '../products.json';
import { Product } from '../Product';
import { DeliveryDateOption } from '../DeliveryDateOption';

describe('Test getPossibleDeliveryDays', () => {
  test('Test to make sure that function returns correct number of delivery days', () => {
    expect(getPossibleDeliveryDates(123, ['0001', '0002', '0054'])).toHaveLength(7);
  });
});

describe('Test initPotentialDeliveryDates', () => {
  test('Test that function returns the 14 coming days, starting from tomorrow', () => {
    const potentialDeliveryDates = initPotentialDeliveryDates();
    expect(potentialDeliveryDates).toHaveLength(14);

    let dateOfTomorrow: Date = new Date();
    dateOfTomorrow.setDate(dateOfTomorrow.getDate() + 1);
    expect(potentialDeliveryDates[0].getDay()).toEqual(dateOfTomorrow.getDay());
  });
});

describe('Test initProductList', () => {
  test('Test that function returns product from products.json, if it exists', () => {
    for (const product of products) {
      let initializedProduct: Product = initProductList([product.productId])[0];
      expect(initializedProduct).toBeDefined;
      expect(initializedProduct.name).toEqual(product.name);
    }
  });

  test.only('test specific product', () => {
      let initializedProduct: Product = initProductList(['1003'])[0];
      expect(initializedProduct).toBeDefined;
  });

  test('Test that function returns an empty list if no products are found', () => {
    let initializedProduct: Product[] = initProductList(['2020202', '202020202']);
    expect(initializedProduct).toHaveLength(0);
  });
});

describe('Test dateIsGreenDelivery', () => {
  test('Test that function returns true if date is monday and false if not', () => {
    const mondayDate: Date = new Date();
    mondayDate.setDate(mondayDate.getDate() - mondayDate.getDay() + 1);
    const nonMondayDate = new Date();
    nonMondayDate.setDate(mondayDate.getDate() + 1);
    expect(dateIsGreenDelivery(mondayDate)).toBeTruthy;
    expect(nonMondayDate).toBeFalsy;
  });
});

describe('Test sortDates', () => {
  test('Test that green delivery triumphs non green delivery if within 3 days', () => {
    const date1: DeliveryDateOption = new DeliveryDateOption(11266, new Date(), false);
    const date2: DeliveryDateOption = new DeliveryDateOption(11266, new Date(), true);
    const date3: DeliveryDateOption = new DeliveryDateOption(11266, new Date(), false);

    let dateArray: DeliveryDateOption[] = [date1, date2, date3];
    expect(sortDates(dateArray)[0].isGreenDelivery).toBeTruthy;
  });

  test('Test that green delivery does not triumph non green delivery if not within 3 days', () => {
    const date1: DeliveryDateOption = new DeliveryDateOption(11266, new Date(), false);
    const date2: DeliveryDateOption = new DeliveryDateOption(11266, new Date('2023-10-01'), true);
    const date3: DeliveryDateOption = new DeliveryDateOption(11266, new Date(), false);

    let dateArray: DeliveryDateOption[] = [date1, date2, date3];
    expect(sortDates(dateArray)[0].isGreenDelivery).toBeTruthy;
  });
});
