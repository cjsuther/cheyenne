import VinculoCuentaService from '../../domain/services/vinculo-cuenta-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';

export default class VinculoCuentaController {

	vinculoCuentaService: VinculoCuentaService;

	constructor(vinculoCuentaService: VinculoCuentaService) {
		this.vinculoCuentaService = vinculoCuentaService;
	}

	getByTributo = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idTipoTributo = req.params.idTipoTributo;
		const idTributo = req.params.idTributo;
		if (!token || !isValidNumber(idTipoTributo, true) || !isValidNumber(idTributo, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.vinculoCuentaService.listByTributo(token, idTipoTributo, idTributo)
			.then(data => res.send(data))
			.catch(next)
	}

}
