# Technical Assignment - Delivery Date Service

A delivery service built in Node.js that will return potential delivery dates for a set of products.

## Assumptions

### Delivery Dates

When considering potential delivery days, the current day is not considered as a delivery day. Meaning, when returning a list of available delivery days for the upcoming 14 days, the 14 days are counted from the day after today.

### Days in Advance

The days in advance means full (delivery) days until the product can be delivered. Meaning, if today is Monday and daysInAdvance property is set to 3, the earliest delivery date will be on Friday.

## Installation

Install the project locally

```git
  git clone https://github.com/fredrikstaahl/deliveryDatesService.git
  cd deliveryDatesService
  npm install
```

## Products.json

Products.json contains a list of products that can be used when passing products to the service.

## Usage/Examples

Example: npm run getDeliveryDates productIds={comma-separated list of product ids} postalCode={postalCode}

Real example:

```bash
npm run getDeliveryDates productIds=0054,0001 postalCode=11266
```

Return:

```json
[
  {
    "postalCode": 11266,
    "deliveryDate": "2022-10-10T22:00:00.000Z",
    "isGreenDelivery": false
  },
  {
    "postalCode": 11266,
    "deliveryDate": "2022-10-11T22:00:00.000Z",
    "isGreenDelivery": false
  },
  {
    "postalCode": 11266,
    "deliveryDate": "2022-10-12T22:00:00.000Z",
    "isGreenDelivery": false
  },
  {
    "postalCode": 11266,
    "deliveryDate": "2022-10-13T22:00:00.000Z",
    "isGreenDelivery": false
  },
  {
    "postalCode": 11266,
    "deliveryDate": "2022-10-16T22:00:00.000Z",
    "isGreenDelivery": true
  },
  {
    "postalCode": 11266,
    "deliveryDate": "2022-10-17T22:00:00.000Z",
    "isGreenDelivery": false
  },
  {
    "postalCode": 11266,
    "deliveryDate": "2022-10-18T22:00:00.000Z",
    "isGreenDelivery": false
  }
]
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```
