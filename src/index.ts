import { getPossibleDeliveryDates } from './deliveryDateService';

//get command arguments and initialize product ids array
const getProductIdsFromArgs = (): string[] => {
  let productIds: string[] = [];
  const argString = process.argv[2];
  const productArguments = argString.substring(argString.indexOf('=')+1);
  productArguments.split(',').map((productId) => productIds.push(productId));
  return productIds;
};

const getPostalCodeFromArgs = (): number => {
  return parseInt(process.argv[3].split('=')[1]);
};

const getDeliveryDates = (postalCode: number, products: string[]): void => {
  getPossibleDeliveryDates(postalCode, productIds);
};

//get arguments to use as input to function.
const productIds: string[] = getProductIdsFromArgs();
const postalCode = getPostalCodeFromArgs();

getDeliveryDates(postalCode, productIds);
