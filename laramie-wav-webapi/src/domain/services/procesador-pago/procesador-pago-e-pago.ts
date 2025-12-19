import { encryptString } from "pluspagos-aes-encryption";
import config from "../../../server/configuration/config";
import PublishService from "../publish-service";
import IProcesadorPago from "./i-procesador-pago";
import { CheckoutPreference } from "../../models/checkout-preference";
import CryptoService from "../crypto-service";
import { REQUEST_METHOD } from "../../../infraestructure/sdk/consts/requestMethodType";
import {
  SendRequest,
  SendRequestFormData,
} from "../../../infraestructure/sdk/utils/request";
import { PaymentData } from "../../models/payment-data";
import * as soap from "soap";

export default class ProcesadorPagoEPago implements IProcesadorPago {
  TOKEN_URL: string;
  SOLICITUD_URL: string;
  API_WSDL_URL: string;
  LOCAL_CHECKOUT_URL: string;
  ID_USUARIO: string;
  ID_ORGANISMO: string;
  PASSWORD: string;
  HASH: string;
  NRO_CONVENIO: string;

  cryptoService: CryptoService;
  publishService: PublishService;

  constructor(cryptoService: CryptoService, publishService: PublishService) {
    this.publishService = publishService;
    this.cryptoService = cryptoService;
    this.TOKEN_URL = config.PASARELA_PAGO.E_PAGO.TOKEN_URL;
    this.SOLICITUD_URL = config.PASARELA_PAGO.E_PAGO.SOLICITUD_URL;
    this.API_WSDL_URL = config.PASARELA_PAGO.E_PAGO.API_WSDL_URL;
    this.LOCAL_CHECKOUT_URL = config.PASARELA_PAGO.E_PAGO.LOCAL_CHECKOUT_URL;
    this.ID_USUARIO = config.PASARELA_PAGO.E_PAGO.ID_USUARIO;
    this.ID_ORGANISMO = config.PASARELA_PAGO.E_PAGO.ID_ORGANISMO;
    this.NRO_CONVENIO = config.PASARELA_PAGO.E_PAGO.NRO_CONVENIO;
    this.PASSWORD = config.PASARELA_PAGO.E_PAGO.PASSWORD;
    this.HASH = config.PASARELA_PAGO.E_PAGO.HASH;
  }

  async getSession() {
    const dataBody = {
      id_usuario: this.ID_USUARIO,
      id_organismo: this.ID_ORGANISMO,
      password: this.PASSWORD,
      hash: this.HASH,
    };
    const url = this.TOKEN_URL;

    return SendRequestFormData(null, null, dataBody, REQUEST_METHOD.POST, url)
      .then((response: any) => {
        if (response.id_resp == "01001") {
          return response.token;
        }
        // console.info("EPago internal error session data:", response.id_resp);
        return "";
      })
      .catch((error) => {
        // console.info("EPago error token data:", error);
        return "";
      });
  }

  async createCheckoutUrl(checkout: CheckoutPreference) {
      const token = (await this.getSession()) as any;

      const detalle = [
        {
          id_item: "1",
          desc_item: checkout.description,
          monto_item: checkout.unit_price,
          cantidad_item: 1,
        },
      ];
      const detalleEncodeado = encodeURIComponent(JSON.stringify(detalle));

      const formDataObj = {
        FormAction: this.SOLICITUD_URL,
        TokenGenerado: token,
        TransaccionComercioId: checkout.codeReference,
        IdOrganismo: this.ID_ORGANISMO,
        NroConvenio: this.NRO_CONVENIO,
        Monto: checkout.unit_price,
        Detalle: detalleEncodeado,
        CallbackCancel: checkout.failureUrl,
        CallbackSuccess: checkout.successUrl,
      };

      const formDataEncrypted = this.cryptoService.encryptObject(formDataObj);
      const formDataEncoded = this.cryptoService.encodeBase64(formDataEncrypted);

      return this.LOCAL_CHECKOUT_URL + formDataEncoded;
  }

  async getPayment(pasarelaPaymentId: string, internalPaymentId: string) {
      const token = (await this.getSession()) as any;

      const client = await soap.createClientAsync(this.API_WSDL_URL);
      const args = {
        version: "2.0",
        credenciales: {
          id_organismo: this.ID_ORGANISMO,
          token: token,
        },
        pago: {
          CodigoUnicoTransaccion: pasarelaPaymentId,
        },
      };

      const [result] = await client.obtener_pagosAsync(args);
      if (result.cantidadTotal.$value == 1) {
        const paymentData: PaymentData = {
          id: result.pago.item.CodigoUnicoTransaccion.$value,
          status: result.pago.item.Estado.$value === "A",
          externalReference: result.pago.item.Externa.$value,
          transactionAmount: result.pago.item.Importe.$value,
          data: result.pago.item,
        };
        return paymentData;
      } else {
        throw new Error("No se pudo obtener el pago.");
      }
  }

  /*
  async consumirApiEpagos() {
    const formData = new FormData();

    formData.append("id_usuario", "74");
    formData.append("id_organismo", "23");
    formData.append("password", "9ba376b2d39065359d7a29dd9dcd98d8");
    formData.append("hash", "70e1d6f75679f556eba1872b52394bec");

    try {
      const response = await fetch("https://sandbox.epagos.com/post.php", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error al consumir la API:", error);
      throw error;
    }
  }
  */
}
