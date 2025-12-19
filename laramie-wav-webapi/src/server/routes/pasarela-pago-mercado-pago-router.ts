import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';

const pasarelaPagoMercadoPagoController = container.resolve('pasarelaPagoMercadoPagoController');
const router = express.Router();

router
    .post('/pasarela-pago/mp/notify-payment', pasarelaPagoMercadoPagoController.postNotifyPayment);

export default router;