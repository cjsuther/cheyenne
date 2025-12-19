import path from "path";
import fs from "fs";
import ProcessError from "../../infraestructure/sdk/error/process-error";
import PasarelaPagoEPagoService from "../../domain/services/pasarela-pago-ep-service";
import { PaymentNotificationEP } from "../../domain/models/payment-notification-ep";

export default class PasarelaPagoEPagoController {
  ePagoService: PasarelaPagoEPagoService;

  constructor(ePagoService: PasarelaPagoEPagoService) {
    this.ePagoService = ePagoService;
  }

  getChekout = (req, res, next) => {
    const queryDataEncoded = req.query.f;
    this.ePagoService
      .getCheckoutData(queryDataEncoded)
      .then((formData) => {
        const filePath = path.join(__dirname, "../../../public/pagos_ep.html");

        // Leer el archivo HTML
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            return res.status(500).send("Error al leer el archivo HTML");
          }

          // Reemplazar el marcador de posición
          const htmlModificado = data
            .replace("{{FormAction}}", formData["FormAction"])
            .replace("{{TokenGenerado}}", formData["TokenGenerado"])
            .replace(
              "{{TransaccionComercioId}}",
              formData["TransaccionComercioId"]
            )
            .replace("{{Monto}}", formData["Monto"])
            .replace("{{IdOrganismo}}", formData["IdOrganismo"])
            .replace("{{NroConvenio}}", formData["NroConvenio"])
            .replace("{{Detalle}}", formData["Detalle"])
            .replace("{{CallbackCancel}}", formData["CallbackCancel"])
            .replace("{{CallbackSuccess}}", formData["CallbackSuccess"]);

          // Enviar el HTML modificado como respuesta
          res.send(htmlModificado);
        });
      })
      .catch(next);
  };

  postNotifyPayment = (req, res, next) => {
    const token = "";
    const dataBody = { ...req.body };

    if (
      dataBody == undefined ||
      (dataBody && Object.keys(dataBody).length === 0)
    ) {
      //console.log("El Body está vacío, posible llamada al agregar webhook");
      res.status(200).send("OK");
    } else {
      let payload = new PaymentNotificationEP();
      try {
        payload.setFromRequest(dataBody);
      } catch (error) {
        next(new ProcessError("Error procesando parámetros", error));
        return;
      }

      this.ePagoService
        .notifyPayment(payload)
        .then((payment) => res.send(payment))
        .catch(next);
    }
  };
}
