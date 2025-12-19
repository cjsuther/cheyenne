import axios from 'axios';
import { XMLParser } from "fast-xml-parser";

import config from "../../../server/configuration/config";
import PublishService from "../publish-service";
import IProcesadorPago from "./i-procesador-pago";
import { CheckoutPreference } from "../../models/checkout-preference";
import CryptoService from "../crypto-service";
import { PaymentData } from "../../models/payment-data";
import { getDateNow, getDateToString } from "../../../infraestructure/sdk/utils/convert";

export default class ProcesadorPagoInterbanking implements IProcesadorPago {

  cryptoService: CryptoService;
  publishService: PublishService;

  BASE_URL: string;
  PRIVATE_KEY: string;
  CODIGO_COMUNIDAD: string;
  CERTIFICADO_CUIT: string;
  CUENTA_RECAUDACION: string;
  USUARIO_NOMBRE: string;
  USUARIO_CLAVE: string;
  USUARIO_CUIL: string;
  USUARIO_PAIS: string;

  constructor(cryptoService: CryptoService, publishService: PublishService) {
    this.publishService = publishService;
    this.cryptoService = cryptoService;

    this.BASE_URL = config.PASARELA_PAGO.INTERBANKING.BASE_URL;
    this.PRIVATE_KEY = config.PASARELA_PAGO.INTERBANKING.PRIVATE_KEY;
    this.CODIGO_COMUNIDAD = config.PASARELA_PAGO.INTERBANKING.CODIGO_COMUNIDAD;
    this.CERTIFICADO_CUIT = config.PASARELA_PAGO.INTERBANKING.CERTIFICADO_CUIT;
    this.CUENTA_RECAUDACION = config.PASARELA_PAGO.INTERBANKING.CUENTA_RECAUDACION;
    this.USUARIO_NOMBRE = config.PASARELA_PAGO.INTERBANKING.USUARIO_NOMBRE;
    this.USUARIO_CLAVE = config.PASARELA_PAGO.INTERBANKING.USUARIO_CLAVE;
    this.USUARIO_CUIL = config.PASARELA_PAGO.INTERBANKING.USUARIO_CUIL;
    this.USUARIO_PAIS = config.PASARELA_PAGO.INTERBANKING.USUARIO_PAIS;
  }

  async createCheckoutUrl(checkout: CheckoutPreference) {
      if (!checkout.clientReference) {
          throw new Error(`Falta el cuit del cliente para generar la pre-confección de pago`);
      }

      const url = this.BASE_URL + "preconfeccionB2B.do?dispatch=recibirPost";
      const pathFileP12 = `${config.PATH.CERTIFICATES}interbanking${config.PATH_SEPARATOR}${this.CERTIFICADO_CUIT}.p12`;

      const dataObj = {
        //datos de la comunidad
        codigoComunidad: this.CODIGO_COMUNIDAD,
        clienteCuit: checkout.clientReference,
        cantidadTransacciones: "1",
        //datos del usuario operador de sistema
        nombre_usuario: this.USUARIO_NOMBRE,
        clave: this.USUARIO_CLAVE,
        cuil: this.USUARIO_CUIL,
        pais: this.USUARIO_PAIS,
        //datos de la operacion (pueden ser n)
        cuentaRecaudacionId1: this.CUENTA_RECAUDACION,
        comprobante1: checkout.idReference, //admite solo 12 caracteres, entonces paso el id
        fechaPago1: getDateToString(getDateNow()),
        importe1: checkout.unit_price.toFixed(2).toString(),
        observacion1: "Eden Producido | Municipalidad Campana",
        //verificador
        signature: ""
      };

      const signatureText = `${dataObj.codigoComunidad}${dataObj.cantidadTransacciones}${dataObj.clienteCuit}${dataObj.fechaPago1}${dataObj.comprobante1}${dataObj.importe1}${dataObj.cuentaRecaudacionId1}${dataObj.observacion1}`;
      const signatureTextEncrypted = this.cryptoService.encryptObjectSHAFromP12(signatureText, pathFileP12, this.PRIVATE_KEY);
      dataObj.signature = signatureTextEncrypted;

      const dataForm = new FormData();
      Object.entries(dataObj).forEach(([clave, valor]) => {
        dataForm.append(clave, valor);
      });

      const { data: rawResponse } = await axios.post(url, dataForm, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        allowBooleanAttributes: true,
        numberParseOptions: {
            leadingZeros: true,
            hex: true,
            skipLike: /\+[0-9]{10}/,
            eNotation: false
        }
      });

      const parsed = parser.parse(rawResponse);
      const result = parsed.TransactionStatusReport;
      if (result.TransactionStatus) {
        if (result.TransactionStatus.Confirmado === "OK") {
          return this.BASE_URL;
        }
        else {
          throw new Error(`Error generando pre-confección de pago: ${result.TransactionStatus.Motivo}`);
        }
      }
      else if (result.Error && result.Error.Mensaje) {
        throw new Error(`Error generando pre-confección de pago: ${result.Error.Mensaje}`);
      }
      else {
        throw new Error(`Error generando pre-confección de pago: error indeterminado`);
      }

  }

  async getPayment(pasarelaPaymentId: string, internalPaymentId: string) {
      const paymentData = new PaymentData();
      //no aplica
      return paymentData;
  }
}
