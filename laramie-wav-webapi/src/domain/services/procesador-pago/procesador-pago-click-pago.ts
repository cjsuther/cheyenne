import { encryptString } from "pluspagos-aes-encryption";
import config from "../../../server/configuration/config";
import PublishService from "../publish-service";
import IProcesadorPago from "./i-procesador-pago";
import { CheckoutPreference } from "../../models/checkout-preference";
import CryptoService from "../crypto-service";
import { REQUEST_METHOD } from "../../../infraestructure/sdk/consts/requestMethodType";
import { SendRequest } from "../../../infraestructure/sdk/utils/request";
import { PaymentData } from "../../models/payment-data";

export default class ProcesadorPagoClickPago implements IProcesadorPago {
  BASE_URL: string;
  BASE_URL_BACKOFFICE: string;
  LOCAL_CHECKOUT_URL: string;
  SECRET_KEY: string;
  GUID_COMERCIO: string;
  FRASE: string;

  cryptoService: CryptoService;
  publishService: PublishService;

  constructor(cryptoService: CryptoService, publishService: PublishService) {
    this.publishService = publishService;
    this.cryptoService = cryptoService;
    this.BASE_URL = config.PASARELA_PAGO.CLICK_PAGO.BASE_URL;
    this.BASE_URL_BACKOFFICE = config.PASARELA_PAGO.CLICK_PAGO.BACKOFFICE_BASE_URL;
    this.LOCAL_CHECKOUT_URL = config.PASARELA_PAGO.CLICK_PAGO.LOCAL_CHECKOUT_URL;
    this.GUID_COMERCIO = config.PASARELA_PAGO.CLICK_PAGO.GUID_COMERCIO;
    this.SECRET_KEY = config.PASARELA_PAGO.CLICK_PAGO.SECRET_KEY;
    this.FRASE = config.PASARELA_PAGO.CLICK_PAGO.FRASE;
  }

  async getSession() {
    const dataBody = {
      guid: this.GUID_COMERCIO,
      frase: this.FRASE,
    };
    const url = this.BASE_URL_BACKOFFICE + "/sesion";

    return SendRequest(null, null, dataBody, REQUEST_METHOD.POST, url)
      .then((response: any) => {
        return response.data;
      })
      .catch((error) => {
        console.info("Macropago error session data:", error);
        return "";
      });
  }

  async createCheckoutUrl(checkout: CheckoutPreference) {
      // Encriptar campos obligatorios
      const callbackSuccess = encryptString(
        checkout.successUrl,
        this.SECRET_KEY
      );
      const callbackCancel = encryptString(
        checkout.failureUrl,
        this.SECRET_KEY
      );
      const monto = encryptString(checkout.unit_price * 100, this.SECRET_KEY);
      const sucursalComercio = encryptString("", this.SECRET_KEY);
      const transaccionComercioId = `${checkout.id}_${checkout.codeReference}`;

      const formDataObj = {
        FormAction: this.BASE_URL,
        TransaccionComercioId: transaccionComercioId,
        Comercio: this.GUID_COMERCIO,
        Monto: monto,
        SucursalComercio: sucursalComercio,
        CallbackCancel: callbackCancel,
        CallbackSuccess: callbackSuccess,
        Producto: checkout.description,
      };

      const formDataEncrypted = this.cryptoService.encryptObject(formDataObj);
      const formDataEncoded =
        this.cryptoService.encodeBase64(formDataEncrypted);

      return (
        this.LOCAL_CHECKOUT_URL +
        formDataEncoded
      );
  }

  async getPayment(pasarelaPaymentId: string, internalPaymentId: string) {
      const token = (await this.getSession()) as any;
      //console.info("macropago token:", token);

      const url =
        this.BASE_URL_BACKOFFICE + "/transaction/" + internalPaymentId;
      const paymentResponse = (await SendRequest(
        token,
        null,
        null,
        REQUEST_METHOD.GET,
        url
      )) as any;

      /*--------------- ESTADOS ---------------
      1 CREADA Transacción creada (no procesada)
      2 EN_PAGO Transacción en pago
      3 REALIZADA Transacción procesada con éxito
      4 RECHAZADA Transacción rechazada
      5 ERROR_VALIDACION_HASH_TOKEN Ocurrió un error en la validación de la firma enviada al crear la transacción
      6 ERROR_VALIDACION_HASH_PAGO Ocurrió un error en la validación de la firma al intentar pagar la transacción
      7 EXPIRADA Transacción expirada
      8 CANCELADA Transacción cancelada por el usuario
      9 DEVUELTA Transacción devuelta
      10 PENDIENTE DEBIN creado correctamente, esperando aprobación.
      11 VENCIDA Transacción vencida porque el DEBIN expiró.
      */
      const data = JSON.parse(paymentResponse.data);
      const paymentData: PaymentData = {
        id: data.TransaccionId,
        status: data.Estado === "REALIZADA",
        externalReference: data.TransaccionComercioId.split("_")[1], //TransaccionComercioId : [id]_[idCuentaPago]
        transactionAmount: parseFloat(data.Monto.replace(",", ".")),
        data: paymentResponse,
      };
      return paymentData;
  }
}
