import express from 'express';
import container from '../../infraestructure/ioc/dependency-injection';
import useAuth from '../middlewares/use-auth';

const pasarelaPagoClickPagoController = container.resolve('pasarelaPagoClickPagoController');
const router = express.Router();

router
    .post('/pasarela-pago/cp/notify-payment', pasarelaPagoClickPagoController.postNotifyPayment)
    .get('/pasarela-pago/cp/checkout', pasarelaPagoClickPagoController.getChekout);

export default router;