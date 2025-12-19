import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import type { PreferenceCreateData } from "mercadopago/dist/clients/preference/create/types";
import type { PaymentGetData } from "mercadopago/dist/clients/payment/get/types";
import config from "../../../server/configuration/config";
import PublishService from "../publish-service";
import IProcesadorPago from "./i-procesador-pago";
import { CheckoutPreference } from "../../models/checkout-preference";
import { PaymentData } from "../../models/payment-data";

export default class ProcesadorPagoMercadoPago implements IProcesadorPago {
  private readonly _client: MercadoPagoConfig;

  publishService: PublishService;

  constructor(publishService: PublishService) {
    this.publishService = publishService;

    const accessToken = config.PASARELA_PAGO.MERCADO_PAGO.ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN no está definido");
    }

    this._client = new MercadoPagoConfig({
      accessToken: accessToken,
      options: {
        timeout: 5000,
      },
    });
  }

  get client(): MercadoPagoConfig {
    return this._client;
  }

  async createCheckoutUrl(checkout: CheckoutPreference) {
    const currentDate = new Date();
    const expirationDateFrom = new Date(currentDate);
    // End of current day
    const expirationDateTo = new Date(currentDate);
    expirationDateTo.setHours(23, 59, 59, 999);
    // 3 days from now
    const dateOfExpiration = new Date(currentDate);
    dateOfExpiration.setDate(currentDate.getDate() + 3);

    const data: PreferenceCreateData = {
      body: {
        items: [
          {
            id: checkout.id,
            title: checkout.title,
            quantity: checkout.quantity,
            description: checkout.description,
            unit_price: checkout.unit_price,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: checkout.successUrl,
          failure: checkout.failureUrl,
        },
        auto_return: "approved",
        binary_mode: true,
        payment_methods: {
          installments: 1,
        },
        external_reference: checkout.codeReference,
        expires: true,
        expiration_date_from: expirationDateFrom.toISOString(),
        expiration_date_to: expirationDateTo.toISOString(),
        date_of_expiration: dateOfExpiration.toISOString(),
      },
    };

    const preference = new Preference(this.client);
    const preferenceResponse = await preference.create(data);
    return preferenceResponse.init_point;
  }

  async getPayment(pasarelaPaymentId: string, internalPaymentId: string) {
    const data: PaymentGetData = {
      id: pasarelaPaymentId,
    };

    const payment = new Payment(this.client);
    let paymentResponse = await payment.get(data);

    const paymentData: PaymentData = {
      id: paymentResponse.id,
      status: paymentResponse.status === "approved",
      externalReference: paymentResponse.external_reference,
      transactionAmount: paymentResponse.transaction_amount,
      data: paymentResponse,
    };
    return paymentData;
  }
  
}
