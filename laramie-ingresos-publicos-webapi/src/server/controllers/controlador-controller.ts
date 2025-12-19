import ControladorDTO from '../../domain/dto/controlador-dto';
import ControladorFilter from '../../domain/dto/controlador-filter';
import ControladorService from '../../domain/services/controlador-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ControladorController {

	controladorService: ControladorService;

	constructor(controladorService: ControladorService) {
		this.controladorService = controladorService;
	}

	get = (req, res, next) => {
		this.controladorService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let controladorFilter = new ControladorFilter();
		controladorFilter.idTipoControlador = parseInt(req.query.idTipoControlador);
		controladorFilter.idPersona = parseInt(req.query.idPersona);
		controladorFilter.idControladorSupervisor = parseInt(req.query.idControladorSupervisor);
		controladorFilter.etiqueta = req.query.etiqueta;
		
		this.controladorService.listByFilter(controladorFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.controladorService.findById(id)
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
		const controladorDTO = new ControladorDTO(); controladorDTO.setFromObject(dataBody);
		this.controladorService.add(dataToken.idUsuario, controladorDTO)
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
		const controladorDTO = new ControladorDTO(); controladorDTO.setFromObject(dataBody);
		this.controladorService.modify(id, dataToken.idUsuario, controladorDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.controladorService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
