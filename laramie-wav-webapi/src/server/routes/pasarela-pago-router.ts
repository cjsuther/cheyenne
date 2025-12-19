import express from "express";
import container from "../../infraestructure/ioc/dependency-injection";
import useAuth from "../middlewares/use-auth";

const pasarelaPagoController = container.resolve("pasarelaPagoController");
const router = express.Router();

router
  .get("/pasarela-pago", useAuth, pasarelaPagoController.get)
  .post(
    "/pasarela-pago/create-checkout-preference",
    useAuth,
    pasarelaPagoController.postCreateCheckout
  );

export default router;
