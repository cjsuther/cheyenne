import { CheckoutPreference } from "../../models/checkout-preference";

export default interface IProcesadorPago {
  createCheckoutUrl(checkout: CheckoutPreference);
  getPayment(pasarelaPaymentId: string, internalPaymentId: string);
}
