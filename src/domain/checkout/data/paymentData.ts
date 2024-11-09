import { CreditCard } from "./payment";

export const visaCreditCard: CreditCard = {
  number: "4242424242424242",
  ownerName: "timmy tester",
  expirationDate: "09 / 27",
  securityCode: "133",
};

export const mastercard: CreditCard = {
  number: "5555555555554444",
  ownerName: "timmy tester",
  expirationDate: "03/30",
  securityCode: "111",
};
