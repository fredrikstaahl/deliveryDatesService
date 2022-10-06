import { getStartOfWeekDate } from './utils';
const weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EXTERNAL_PRODUCT_DAYS_IN_ADVANCE = 5;

export class Product {
  productId: string;
  name: string;
  deliveryDays: string[];
  productType: string;
  daysInAdvance: number;

  constructor(productId: string, name: string, deliveryDays: string[], productType: string, daysInadvance: number) {
    this.productId = productId;
    this.name = name;
    this.deliveryDays = deliveryDays;
    this.productType = productType;
    this.daysInAdvance = daysInadvance;
  }
  /**
   * The function takes a list of potential delivery days
   * and will return a list of days when the product cannot be delivered
   * based on the following constaints:
   * - deliveryDays
   * - productType
   * - daysInAdvance
   * @param potentialDeliveryDays
   * @returns a list of restricted delivery days
   */
  getDeliveryRestrictions(potentialDeliveryDays: Date[]): Date[] {
    let restrictedDeliveryDates: Set<Date> = new Set<Date>();

    this.getDeliveryRestrictionsDaysInAdvance(potentialDeliveryDays).forEach((date) => restrictedDeliveryDates.add(date));
    //console.log(`daysInAdvance: ${restrictedDeliveryDates.size}`);
    this.getDeliveryRestrictionsDeliveryDays(potentialDeliveryDays).forEach((date) => restrictedDeliveryDates.add(date));
    //console.log(`deliveryDates: ${restrictedDeliveryDates.size}`);
    if (this.productType == 'external') {
      this.getDeliveryRestrictionsExternalProduct(potentialDeliveryDays).forEach((date) =>
        restrictedDeliveryDates.add(date)
      );
    } else if (this.productType == 'temporary') {
      this.getDeliveryRestrictionsTemporaryProduct(potentialDeliveryDays).forEach((date) =>
        restrictedDeliveryDates.add(date)
      );
    }
    //console.log('Returning the following restrictions: ' + Array.from(restrictedDeliveryDates));
    return Array.from(restrictedDeliveryDates);
  }

  /**
   * The function returns an array of dates when the product cannot be
   * delivered based on the daysInAdvance property on the product. I.E if
   * daysInadvance = 4, all delivery dates before today+4 are restricted
   * as the product cannot be delivered on time.
   * @param potentialDeliveryDays
   * @returns an array of dates when the product cannot be delivered.
   */
  getDeliveryRestrictionsDaysInAdvance(potentialDeliveryDays: Date[]): Date[] {
    const deliveryRestrictions: Date[] = [];
    const dateToCompare: Date = new Date();
    dateToCompare.setDate(dateToCompare.getDate() + this.daysInAdvance);
    for (const deliveryDate of potentialDeliveryDays) {
      if (deliveryDate <= dateToCompare) {
        deliveryRestrictions.push(deliveryDate);
      }
    }
    return deliveryRestrictions;
  }

  /**
   * The function returns an array of dates when the product cannot be
   * delivered based on the deliverDays property
   *  defined as eligible for delivery on the product.
   * @param potentialDeliveryDays
   * @returns an array of dates when the product cannot be delivered.
   */
  getDeliveryRestrictionsDeliveryDays(potentialDeliveryDays: Date[]): Date[] {
    const deliveryRestrictions: Date[] = [];
    for (const deliveryDate of potentialDeliveryDays) {
      if (!this.deliveryDays.includes(weekDays[deliveryDate.getDay()])) {
        deliveryRestrictions.push(deliveryDate);
      }
    }
    return deliveryRestrictions;
  }

  /**
   * The function returns an array of dates within 5 days of the
   * current date, since external products need to be oredered 5 days
   * in advance.
   * @param potentialDeliveryDays
   * @returns an array of dates when the product cannot be delivered.
   */
  getDeliveryRestrictionsExternalProduct(potentialDeliveryDays: Date[]): Date[] {
    const deliveryRestrictions: Date[] = [];
    const dateToCompare: Date = new Date();
    dateToCompare.setDate(dateToCompare.getDate() + EXTERNAL_PRODUCT_DAYS_IN_ADVANCE);
    for (const deliveryDate of potentialDeliveryDays) {
      if (deliveryDate <= dateToCompare) {
        deliveryRestrictions.push(deliveryDate);
      }
    }
    return deliveryRestrictions;
  }

  /**
   * The function returns an array of dates that are not within
   * the current week (Mon-Sun)
   * @param potentialDeliveryDays
   * @returns an array of dates when the product cannot be delivered.
   */
  getDeliveryRestrictionsTemporaryProduct(potentialDeliveryDays: Date[]): Date[] {
    const deliveryRestrictions: Date[] = [];

    const startOfTheWeek: Date = getStartOfWeekDate(new Date());
    const endOfWeek: Date = new Date();
    endOfWeek.setDate(startOfTheWeek.getDate() + 6);

    for (const deliveryDate of potentialDeliveryDays) {
      if (deliveryDate < startOfTheWeek || deliveryDate > endOfWeek) {
        deliveryRestrictions.push(deliveryDate);
      }
    }
    return deliveryRestrictions;
  }
}
