import SesionService from '../../domain/services/sesion-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';

export default class SesionController {

	sesionService: SesionService;

	constructor(sesionService: SesionService) {
		this.sesionService = sesionService;
	}

	expirateSesion = async (req, res, next) => {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.sesionService.expirateSesion(token)
			.then(row => res.send(row))
			.catch(next)
	}

}
