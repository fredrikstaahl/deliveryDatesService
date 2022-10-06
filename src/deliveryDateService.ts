import products from './products.json';
import { Product } from './Product';
import { DeliveryDateOption } from './DeliveryDateOption';

const MAX_DELIVERY_DAYS = 14;
const MONDAY = 1;

/**
 * @returns a list of potential delivery days starting from tomorrow
 */
export const initPotentialDeliveryDates = (): Date[] => {
  let dateOfTomorrow = new Date();
  dateOfTomorrow.setDate(new Date().getDate() + 1);
  dateOfTomorrow.setHours(0, 0, 0, 0);
  let dates: Date[] = [dateOfTomorrow];
  for (let i = 0; i < MAX_DELIVERY_DAYS - 1; i++) {
    let tempDate = new Date();
    tempDate.setDate(dates[i].getDate() + 1);
    tempDate.setHours(0, 0, 0, 0);
    dates.push(tempDate);
  }
  return dates;
};

/**
 * Instantiate a list products based on productIds passed as argument
 * that is matched towards ./products.json file. This would be a db-call
 * in a live environment.
 * @param productIds - list of productIds to match towards ./products.json
 * @returns a list of procucts that will be used to determine possible delivery days.
 */
export const initProductList = (productIds: string[]): Product[] => {
  let productList: Product[] = [];
  for (let i = 0; i < productIds.length; i++) {
    products
      .filter((product) => product.productId === productIds[i])
      .map((product) =>
        productList.push(
          new Product(product.productId, product.name, product.deliveryDays, product.productType, product.daysInAdvance)
        )
      );
  }
  return productList;
};

//Returns list of possible delivery days for a list of products.
/**
 * @param postalCode
 * @param products - a string array product IDs.
 * @returns
 */
export const getPossibleDeliveryDates = (postalCode: number, products: string[]): DeliveryDateOption[] => {
  let potentialDeliveryDates: Date[] = initPotentialDeliveryDates();
  const productList: Product[] = initProductList(products);

  if(productList.length == 0) {
    console.log('No products found.');
    return [];
  }

  let deliveryDateOptions: DeliveryDateOption[] = [];
  let restrictedDeliveryDaysSet: Set<Date> = new Set<Date>();

  //Iterate each product and return restricted delivery dates
  for (const product of productList) {
    product
      .getDeliveryRestrictions(potentialDeliveryDates)
      .forEach((restrictedDate) => restrictedDeliveryDaysSet.add(restrictedDate));
  }

  const restrictedDeliveryDays = Array.from(restrictedDeliveryDaysSet);

  /**
   * Iterate each potential delivery day and remove it from potential
   * it is one of the restricted days
   *
   */
  for (let i = 0; i < potentialDeliveryDates.length; i++) {
    if (restrictedDeliveryDays.includes(potentialDeliveryDates[i])) {
      potentialDeliveryDates.splice(i, 1);
      i--;
    }
  }

  //Instantiate deliveryDateOptions to return
  potentialDeliveryDates.map((date) =>
    deliveryDateOptions.push(new DeliveryDateOption(postalCode, date, dateIsGreenDelivery(date)))
  );
  //sortDates(deliveryDateOptions);
  console.log(JSON.stringify(deliveryDateOptions));
  return deliveryDateOptions;
};

/**
 * Every monday, we get to use a giant vacuum that
 * will magically erase our carbon footprint. There for,
 * monday's are our green delivery day!
 * @param deliveryDate
 * @returns (true/false) whether the date is a "green delivery date"
 */
export const dateIsGreenDelivery = (deliveryDate: Date): boolean => {
  return deliveryDate.getDay() == MONDAY ? true : false;
};

/**
 * NOTE! This function is not working and i'd be happy to discuss why this
 * @param deliveryDateOptions
 * @returns
 */
export const sortDates = (deliveryDateOptions: DeliveryDateOption[]): DeliveryDateOption[] => {
  let dateInThreeDays: Date = new Date();
  dateInThreeDays.setDate(dateInThreeDays.getDate() + 3);
  return deliveryDateOptions.sort((a, b) => {
    if (a.isGreenDelivery && !b.isGreenDelivery) {
      if (a.deliveryDate < dateInThreeDays) {
        console.log(`a is within three days`);
        return -1;
      }
    } else if (b.isGreenDelivery && !a.isGreenDelivery) {
      if (b.deliveryDate < dateInThreeDays) {
        return 1;
      }
    }
    return 0;
  });
};
