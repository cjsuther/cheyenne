import ProcedimientoDTO from '../../domain/dto/procedimiento-dto';
import ProcedimientoService from '../../domain/services/procedimiento-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ProcedimientoController {

	procedimientoService: ProcedimientoService;

	constructor(procedimientoService: ProcedimientoService) {
		this.procedimientoService = procedimientoService;
	}

	get = (req, res, next) => {
		this.procedimientoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.procedimientoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getFullById = (req, res, next) => {
		const id = req.params.id;
		this.procedimientoService.findFullById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
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
		const procedimientoDTO = new ProcedimientoDTO(); procedimientoDTO.setFromObject(dataBody);
		this.procedimientoService.add(dataToken.idUsuario, procedimientoDTO)
			.then(row => res.send(row))
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

		const id = req.params.id;
		const dataBody = {...req.body};
		const procedimientoDTO = new ProcedimientoDTO(); procedimientoDTO.setFromObject(dataBody);
		this.procedimientoService.modify(id, dataToken.idUsuario, procedimientoDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.procedimientoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
