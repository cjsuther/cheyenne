import ProcessError from '../../infraestructure/sdk/error/process-error';
import InformacionAdicionalDTO from '../../domain/dto/informacion-adicional-dto';
import InformacionAdicionalService from '../../domain/services/informacion-adicional-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class InformacionAdicionalController {

	informacionAdicionalService: InformacionAdicionalService;

	constructor(informacionAdicionalService: InformacionAdicionalService) {
		this.informacionAdicionalService = informacionAdicionalService;
	}

	getByEntidad = (req, res, next) => {
		const entidad = req.params.entidad;
		const idEntidad = req.params.idEntidad;
		this.informacionAdicionalService.listByEntidad(entidad, idEntidad)
			.then(data => res.send(data))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new UnauthorizedError('No se pudo obtener información del Token'));
			return;
		}

		const dataBody = {...req.body};
		const informacionAdicionalDTO = new InformacionAdicionalDTO();
		try {
			informacionAdicionalDTO.setFromObject(dataBody);
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}
		this.informacionAdicionalService.modify(dataToken.idUsuario, informacionAdicionalDTO)
			.then(id => res.send(id))
			.catch(next)
	}

}
