import InformacionAdicionalService from '../../domain/services/informacion-adicional-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class InformacionAdicionalController {

	informacionAdicionalService: InformacionAdicionalService;

	constructor(informacionAdicionalService: InformacionAdicionalService) {
		this.informacionAdicionalService = informacionAdicionalService;
	}

	getByEntidad = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const entidad = req.params.entidad;
		const idEntidad = req.params.idEntidad;
		if (!token || !isValidString(entidad, true) || !isValidNumber(idEntidad, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.informacionAdicionalService.listByEntidad(token, entidad, idEntidad)
			.then(data => res.send(data))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.informacionAdicionalService.modify(token, dataBody)
			.then(id => res.send(id))
			.catch(next)
	}

}
