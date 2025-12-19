import express from "express";

import LoginRouter from "./login-router";
import ListaRouter from "./lista-router";
import ComunicacionRouter from "./comunicacion-router";
import CuentaRouter from "./cuenta-router";
import ContribuyenteRouter from "./contribuyente-router";
import PasarelaPagoMercadoPagoRouter from "./pasarela-pago-mercado-pago-router";
import PasarelaPagoClickPagoRouter from "./pasarela-pago-click-pago-router";
import PasarelaPagoEPagoRouter from "./pasarela-pago-e-pago-router";
import PasarelaPagoRouter from "./pasarela-pago-router";

const router = express.Router();

const getRoutes = () => {
  router.use("/api", LoginRouter);
  router.use("/api", ListaRouter);
  router.use("/api", ComunicacionRouter);
  router.use("/api", CuentaRouter);
  router.use("/api", ContribuyenteRouter);
  router.use("/api", PasarelaPagoRouter);
  router.use("/api", PasarelaPagoMercadoPagoRouter);
  router.use("/api", PasarelaPagoClickPagoRouter);
  router.use("/api", PasarelaPagoEPagoRouter);
};

getRoutes();

export default router;
