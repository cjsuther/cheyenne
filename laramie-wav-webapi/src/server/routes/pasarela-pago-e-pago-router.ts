import express from "express";
import container from "../../infraestructure/ioc/dependency-injection";
import useAuth from "../middlewares/use-auth";

const pasarelaPagoEPagoController = container.resolve(
  "pasarelaPagoEPagoController"
);
const router = express.Router();

router
  .post(
    "/pasarela-pago/ep/notify-payment",
    express.urlencoded({ extended: true }), // Middleware aplicado solo aquí
    pasarelaPagoEPagoController.postNotifyPayment
  )
  .get("/pasarela-pago/ep/checkout",  pasarelaPagoEPagoController.getChekout);


export default router;
