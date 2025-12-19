import config from "../../server/configuration/config";
import PublishService from "./publish-service";
import PasarelaPagoService from "./pasarela-pago-service";
import ApiError from "../../infraestructure/sdk/error/api-error";
import ProcessError from "../../infraestructure/sdk/error/process-error";
import CryptoService from "./crypto-service";
import { NotifyPayment } from "../models/notify-payment";
import { getDateNow } from "../../infraestructure/sdk/utils/convert";
import ValidationError from "../../infraestructure/sdk/error/validation-error";
import CustomError from "../../infraestructure/sdk/error/custom-error";
import MicroserviceError from "../../infraestructure/sdk/error/microservice-error";
import ProcesadorPagoEPago from "./procesador-pago/procesador-pago-e-pago";
import { PaymentNotificationEP } from "../models/payment-notification-ep";

export default class PasarelaPagoEPagoService {
  private readonly cryptoService;
  private readonly pasarelaPagoService: PasarelaPagoService;
  private readonly publishService: PublishService;
  private readonly procesadorPagoEPago: ProcesadorPagoEPago;
  private readonly pasarelaId: number;

  constructor(
    publishService: PublishService,
    cryptoService: CryptoService,
    pasarelaPagoService: PasarelaPagoService,
    procesadorPagoEPago: ProcesadorPagoEPago
  ) {
    this.cryptoService = cryptoService;
    this.pasarelaPagoService = pasarelaPagoService;
    this.procesadorPagoEPago = procesadorPagoEPago;
    this.publishService = publishService;
    this.pasarelaId = parseInt(config.PASARELA_PAGO.E_PAGO.ID);
  }

  async getCheckoutData(queryDataEncoded: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const recoverDataEncrypted =
          this.cryptoService.decodeBase64(queryDataEncoded);
        const recoverDataObj =
          this.cryptoService.decryptObject(recoverDataEncrypted);

        resolve(recoverDataObj);
      } catch (error) {
        if (error.statusCode && error.message) {
          reject(new ApiError(error.message, error.statusCode));
        } else {
          reject(new ProcessError("Error procesando datos", error));
        }
      }
    });
  }

  async notifyPayment(payload: PaymentNotificationEP) {
    return new Promise(async (resolve, reject) => {
      try {
        const data: NotifyPayment = {
          idPasarela: this.pasarelaId,
          pasarelaPaymentId: payload.idTransaccion,
          internalPaymentId: payload.numeroOperacion,
        };
        const payment = await this.pasarelaPagoService.notifyPayment(data);

        resolve(true);
      } catch (error) {
        const data = {
          token: `paymentId:${payload?.idTransaccion}`,
          idTipoAlerta: 34, //Pasarela Pago
          idUsuario: 0,
          fecha: getDateNow(true),
          idModulo: 30,
          origen: "laramie-wav-webapi/pasarela-pago-ep-service/notifyPayment",
          mensaje: "Error de Notificación de Pago - E Pago",
          data: {
            error:
              error instanceof ValidationError
                ? {
                    name: "ValidationError",
                    message: error.message.toString(),
                    stack: "",
                  }
                : error instanceof TypeError
                ? {
                    name: "TypeError",
                    message: error.message.toString(),
                    stack: error.stack,
                  }
                : error,
            message: "Error de Notificación de Pago",
            payload: payload,
          },
        };
        try {
          await this.publishService.sendMessage(
            "laramie-wav-webapi/pasarela-pago-ep-service/notifyPayment",
            "AddAlerta",
            "0",
            data
          );
          reject(new CustomError("Error procesando pasarela de pagos"));
        } catch (error) {
          reject(
            new MicroserviceError(
              "Error enviando AddAlerta",
              error,
              "AddAlerta",
              data
            )
          );
        }
      }
    });
  }
}
