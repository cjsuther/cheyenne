import { v4 as uuidv4 } from "uuid";
import config from "../../server/configuration/config";
import { CheckoutPago } from "../models/checkout-pago";
import PublishService from "./publish-service";
import { getDateNow } from "../../infraestructure/sdk/utils/convert";
import IProcesadorPago from "./procesador-pago/i-procesador-pago";
import { CheckoutPreference } from "../models/checkout-preference";
import { NotifyPayment } from "../models/notify-payment";
import ProcesadorPagoMercadoPago from "./procesador-pago/procesador-pago-mercado-pago";
import ProcesadorPagoClickPago from "./procesador-pago/procesador-pago-click-pago";
import CuentaPagoResumen from "../entities/cuenta-pago-resumen";
import CuentaPagoService from "./cuenta-pago-service";
import ProcessError from "../../infraestructure/sdk/error/process-error";

import IMAGE_BASE64_MERCADOPAGO from "../../infraestructure/sdk/images-base64/logo-mercadopago";
import IMAGE_BASE64_MACROPAGO from "../../infraestructure/sdk/images-base64/logo-macropago";
import IMAGE_BASE64_EPAGO from "../../infraestructure/sdk/images-base64/logo-epago";
import ApiError from "../../infraestructure/sdk/error/api-error";
import ValidationError from "../../infraestructure/sdk/error/validation-error";
import ProcesadorPagoEPago from "./procesador-pago/procesador-pago-e-pago";
import ProcesadorPagoInterbanking from "./procesador-pago/procesador-pago-interbanking";
import ComercioService from "./comercio-service";
import CuentaService from "./cuenta-service";
import Cuenta from "../entities/cuenta";
import { TRIBUTO_TYPE } from "../../infraestructure/sdk/consts/tributoType";
import Comercio from "../entities/comercio";
import { PaymentData } from "../models/payment-data";
import IMAGE_BASE64_INTERBANKING from "../../infraestructure/sdk/images-base64/logo-interbanking";

export default class PasarelaPagoService {
  private readonly procesadorPagoMercadoPago: ProcesadorPagoMercadoPago;
  private readonly procesadorPagoClickPago: ProcesadorPagoClickPago;
  private readonly procesadorPagoEPago: ProcesadorPagoEPago;
  private readonly procesadorPagoInterbanking: ProcesadorPagoInterbanking;
  publishService: PublishService;
  cuentaPagoService: CuentaPagoService;
  cuentaService: CuentaService;
  comercioService: ComercioService;

  constructor(
    publishService: PublishService,
    procesadorPagoMercadoPago: ProcesadorPagoMercadoPago,
    procesadorPagoClickPago: ProcesadorPagoClickPago,
    procesadorPagoEPago: ProcesadorPagoEPago,
    procesadorPagoInterbanking: ProcesadorPagoInterbanking,
    cuentaPagoService: CuentaPagoService,
    cuentaService: CuentaService,
    comercioService: ComercioService
  ) {
    this.publishService = publishService;
    this.procesadorPagoMercadoPago = procesadorPagoMercadoPago;
    this.procesadorPagoClickPago = procesadorPagoClickPago;
    this.procesadorPagoEPago = procesadorPagoEPago;
    this.procesadorPagoInterbanking = procesadorPagoInterbanking;
    this.cuentaPagoService = cuentaPagoService;
    this.cuentaService = cuentaService;
    this.comercioService = comercioService;
  }

  client(pasarelaId: number): IProcesadorPago {
    switch (parseInt(pasarelaId.toString())) {
      case parseInt(config.PASARELA_PAGO.MERCADO_PAGO.ID):
        return this.procesadorPagoMercadoPago;
      case parseInt(config.PASARELA_PAGO.CLICK_PAGO.ID):
        return this.procesadorPagoClickPago;
      case parseInt(config.PASARELA_PAGO.E_PAGO.ID):
        return this.procesadorPagoEPago;
      case parseInt(config.PASARELA_PAGO.INTERBANKING.ID):
        return this.procesadorPagoInterbanking;
      default:
        break;
    }
  }

  async list(token: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = [
          // {
          //   idPasarela: 1,
          //   nombre: "Mercado Pago",
          //   imagen: IMAGE_BASE64_MERCADOPAGO,
          // },
          // {
          //   idPasarela: 2,
          //   nombre: "Macro Click de Pago",
          //   imagen: IMAGE_BASE64_MACROPAGO,
          // },
          {
            idPasarela: 3,
            nombre: "E Pago",
            imagen: IMAGE_BASE64_EPAGO,
          },
          {
            idPasarela: 4,
            nombre:"Interbanking",
            imagen: IMAGE_BASE64_INTERBANKING,
          },
        ];

        resolve(data);
      } catch (error) {
        reject(new ProcessError("Error procesando pasarela de pagos", error));
      }
    });
  }

  async createCheckout(token: string, checkoutPago: CheckoutPago) {
    return new Promise(async (resolve, reject) => {
      try {
        const recibo = (await this.cuentaPagoService.findById(token, checkoutPago.idCuentaPago)) as CuentaPagoResumen;
        const cuenta = (await this.cuentaService.findById(token, recibo.idCuenta)) as Cuenta;
        let comercio:Comercio = null;
        if (cuenta.idTipoTributo === TRIBUTO_TYPE.COMERCIOS) {
          const dto = await this.comercioService.findById(token, cuenta.idTributo) as any;
          comercio = dto.comercio as Comercio;
        }
        else {
          comercio = new Comercio();
        }

        const checkoutPreference: CheckoutPreference = {
          id: uuidv4(),
          title: `Pago de Recibo Nro. ${recibo.numero}`,
          quantity: 1,
          description: `Pago de Recibo Nro. ${recibo.numero}`,
          unit_price: recibo.importeVencimiento,
          idReference: recibo.id.toString(),
          codeReference: recibo.codigoBarras.substring(0,18),
          clientReference: comercio.numeroCuit,
          successUrl: config.SITE.WEB_SUCCESS,
          failureUrl: config.SITE.WEB_FAILURE
        };

        const result = await this.client(
          checkoutPago.idPasarela
        ).createCheckoutUrl(checkoutPreference);
        resolve(result);
      } catch (error) {
        if (error instanceof ApiError) {
          reject(new ValidationError("No se pudo obtener el recibo"));
        } else {
          reject(new ProcessError("Error procesando pasarela de pagos", error));
        }
      }
    });
  }

  async notifyPayment(notifyPago: NotifyPayment) {
    const payment = await this.client(notifyPago.idPasarela).getPayment(
      notifyPago.pasarelaPaymentId,
      notifyPago.internalPaymentId
    ) as PaymentData;

    if (payment.status) {
      const dataAddPagoProvisorio = {
        idPasarela: notifyPago.idPasarela,
        identificadorFactura: payment.externalReference,
        importe: payment.transactionAmount,
        numeroTransaccion: payment.id,
      };
      await this.publishService.sendMessage(
        "laramie-wav-webapi/pasarela-pago-service/notifyPayment",
        "AddPagoProvisorio",
        "0",
        dataAddPagoProvisorio
      );

      const dataAddEvento = {
        token: `idPasarela:${notifyPago.idPasarela}-paymentId:${notifyPago.pasarelaPaymentId}`,
        idTipoEvento: 23, //Notificacion Pago
        idUsuario: 0,
        fecha: getDateNow(true),
        idModulo: 30,
        origen: `laramie-wav-webapi/pasarela-pago-service/notifyPayment`,
        mensaje: `Notificación de Pago`,
        data: payment,
      };
      await this.publishService.sendMessage(
        "laramie-wav-webapi/pasarela-pago-service/notifyPayment",
        "AddEvento",
        "0",
        dataAddEvento
      );
    }
    // else console.error(`failed payment: idCuentaPago ${payment.idCuentaPago}`);

    return payment;
  }
}
