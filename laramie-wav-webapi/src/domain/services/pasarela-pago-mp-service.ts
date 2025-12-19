import config from "../../server/configuration/config";
import { PaymentNotificationMP } from "../models/payment-notification-mp";
import PublishService from "./publish-service";
import PasarelaPagoService from "./pasarela-pago-service";
import { NotifyPayment } from "../models/notify-payment";
import Crypto from "crypto";
import ValidationError from "../../infraestructure/sdk/error/validation-error";
import { getDateNow } from "../../infraestructure/sdk/utils/convert";
import CustomError from "../../infraestructure/sdk/error/custom-error";
import MicroserviceError from "../../infraestructure/sdk/error/microservice-error";

export default class PasarelaPagoMercadoPagoService {
  private readonly pasarelaId: number;
  private readonly secretAccessKey: string;

  pasarelaPagoService: PasarelaPagoService;
  publishService: PublishService;

  constructor(
    publishService: PublishService,
    pasarelaPagoService: PasarelaPagoService
  ) {
    this.publishService = publishService;
    this.pasarelaPagoService = pasarelaPagoService;

    this.pasarelaId = parseInt(config.PASARELA_PAGO.MERCADO_PAGO.ID);
    this.secretAccessKey = config.PASARELA_PAGO.MERCADO_PAGO.WEBHOOK_SECRET_KEY;
  }

  async notifyPayment(payload: PaymentNotificationMP) {
    return new Promise(async (resolve, reject) => {
      try {
        this.validateNotification(payload);

        const data: NotifyPayment = {
          idPasarela: this.pasarelaId,
          pasarelaPaymentId: payload.data.id,
          internalPaymentId: "",
        };

        const payment = await this.pasarelaPagoService.notifyPayment(data);

        resolve(true);
      } catch (error) {
        const data = {
          token: `paymentId:${payload?.data?.id}`,
          idTipoAlerta: 34, //Pasarela Pago
          idUsuario: 0,
          fecha: getDateNow(true),
          idModulo: 30,
          origen: "laramie-wav-webapi/pasarela-pago-mp-service/notifyPayment",
          mensaje: "Error de Notificación de Pago - Mercado Pago",
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
            "laramie-wav-webapi/pasarela-pago-mp-service/notifyPayment",
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

  validateNotification(payload: PaymentNotificationMP) {
    if (!payload.signature) {
      // HMAC verification failed
      throw new ValidationError(
        "No se pudo validar la notificacion de pago de Mercado Pago: missing signature"
      );
    }

    // Separating the x-signature into parts
    const parts = payload.signature.split(",");

    // Initializing variables to store ts and hash
    let ts;
    let hash;

    // Iterate over the values to obtain ts and v1
    parts.forEach((part) => {
      // Split each part into key and value
      const [key, value] = part.split("=");
      if (key && value) {
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        if (trimmedKey === "ts") {
          ts = trimmedValue;
        } else if (trimmedKey === "v1") {
          hash = trimmedValue;
        }
      }
    });

    // Generate the manifest string
    const manifest = `id:${payload.data.id};request-id:${payload.requestId};ts:${ts};`;

    // Obtain the hash result as a hexadecimal string
    const hmac = Crypto.createHmac("sha256", this.secretAccessKey);

    const sha = hmac.update(manifest).digest("hex");
    if (!(sha === hash)) {
      // HMAC verification failed
      throw new ValidationError(
        "No se pudo validar la notificacion de pago de Mercado Pago: invalid signature"
      );
    }
  }
}
