export class DeliveryDateOption {
  postalCode: number;
  deliveryDate: Date;
  isGreenDelivery: boolean;

  constructor(postalCode: number, deliveryDate: Date, isGreenDelivery: boolean) {
    this.postalCode = postalCode;
    this.deliveryDate = deliveryDate;
    this.isGreenDelivery = isGreenDelivery;
  }
}
