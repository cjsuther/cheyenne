import ConfiguracionService from '../../domain/services/configuracion-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { getTokenFromRequest } from '../authorization/token';


export default class ConfiguracionController {

	configuracionService: ConfiguracionService;

	constructor(configuracionService: ConfiguracionService) {
		this.configuracionService = configuracionService;
	}

	getByNombre = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const nombre = req.params.nombre;
		if (!token || nombre.length === 0) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.configuracionService.findByNombre(token, nombre)
			.then(row => res.send(row))
			.catch(next)
	}

}
