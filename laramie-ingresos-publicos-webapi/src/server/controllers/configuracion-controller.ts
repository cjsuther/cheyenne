import Configuracion from '../../domain/entities/configuracion';
import ConfiguracionService from '../../domain/services/configuracion-service';

export default class ConfiguracionController {

	configuracionService: ConfiguracionService;

	constructor(configuracionService: ConfiguracionService) {
		this.configuracionService = configuracionService;
	}

	getByNombre = (req, res, next) => {
		const nombre = req.params.nombre;
		this.configuracionService.findByNombre(nombre)
			.then(row => res.send(row))
			.catch(next)
	}

}
