import { PaymentNotificationMP as PaymentNotificationMP } from '../../domain/models/payment-notification-mp';
import PasarelaPagoMercadoPagoService from '../../domain/services/pasarela-pago-mp-service';
import ProcessError from '../../infraestructure/sdk/error/process-error';


export default class PasarelaPagoMercadoPagoController {

  mercadoPagoService: PasarelaPagoMercadoPagoService;

  constructor(mercadoPagoService: PasarelaPagoMercadoPagoService) {
    this.mercadoPagoService = mercadoPagoService;
  }
  
  postNotifyPayment = (req, res, next) => {
    const dataBody = {...req.body};
    const signature = req.headers['x-signature'];
    const requestId = req.headers['x-request-id'];
    
    let payload = new PaymentNotificationMP();
    try {
      payload.setFromRequest(signature, requestId, dataBody);
    }
    catch(error) {
      next(new ProcessError('Error procesando parámetros', error));
			return;
    }

    this.mercadoPagoService.notifyPayment(payload)
      .then(payment => res.send(payment))
      .catch(next)
  }
}
