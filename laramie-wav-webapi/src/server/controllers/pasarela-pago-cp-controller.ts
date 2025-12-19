import path from "path";
import fs from "fs";
import PasarelaPagoClickPagoService from "../../domain/services/pasarela-pago-cp-service";
import ProcessError from "../../infraestructure/sdk/error/process-error";
import { PaymentNotificationCP } from "../../domain/models/payment-notification-cp";

export default class PasarelaPagoClickPagoController {
  clickPagoService: PasarelaPagoClickPagoService;

  constructor(clickPagoService: PasarelaPagoClickPagoService) {
    this.clickPagoService = clickPagoService;
  }

  getChekout = (req, res, next) => {
    const queryDataEncoded = req.query.f;
    this.clickPagoService
      .getCheckoutData(queryDataEncoded)
      .then((formData) => {
        const filePath = path.join(__dirname, "../../../public/pagos_cp.html");

        // Leer el archivo HTML
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            return res.status(500).send("Error al leer el archivo HTML");
          }

          // Reemplazar el marcador de posición
          const htmlModificado = data
            .replace("{{FormAction}}", formData["FormAction"])
            .replace(
              "{{TransaccionComercioId}}",
              formData["TransaccionComercioId"]
            )
            .replace("{{Comercio}}", formData["Comercio"])
            .replace("{{Monto}}", formData["Monto"])
            .replace("{{SucursalComercio}}", formData["SucursalComercio"])
            .replace("{{CallbackCancel}}", formData["CallbackCancel"])
            .replace("{{CallbackSuccess}}", formData["CallbackSuccess"])
            .replace("{{Producto}}", formData["Producto"]);

          // Enviar el HTML modificado como respuesta
          res.send(htmlModificado);
        });
      })
      .catch(next);
  };

  postNotifyPayment = (req, res, next) => {
    const token = "";
    const dataBody = { ...req.body };

    let payload = new PaymentNotificationCP();
    try {
      payload.setFromRequest(dataBody);
    } catch (error) {
      next(new ProcessError("Error procesando parámetros", error));
      return;
    }

    this.clickPagoService
      .notifyPayment(payload)
      .then((payment) => res.send(payment))
      .catch(next);
  };
}
