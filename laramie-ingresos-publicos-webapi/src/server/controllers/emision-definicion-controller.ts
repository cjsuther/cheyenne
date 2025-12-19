import EmisionDefinicionDTO from '../../domain/dto/emision-definicion-dto';
import EmisionDefinicionFilter from '../../domain/dto/emision-definicion-filter';
import EmisionDefinicion from '../../domain/entities/emision-definicion';
import EmisionDefinicionService from '../../domain/services/emision-definicion-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class EmisionDefinicionController {

	emisionDefinicionService: EmisionDefinicionService;

	constructor(emisionDefinicionService: EmisionDefinicionService) {
		this.emisionDefinicionService = emisionDefinicionService;
	}

	get = (req, res, next) => {
		this.emisionDefinicionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let emisionDefinicionFilter = new EmisionDefinicionFilter();
		emisionDefinicionFilter.idTipoTributo = req.query.idTipoTributo;
		emisionDefinicionFilter.numero = req.query.numero;
		emisionDefinicionFilter.descripcion = req.query.descripcion;
		emisionDefinicionFilter.etiqueta = req.query.etiqueta;
		
		this.emisionDefinicionService.listByFilter(emisionDefinicionFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.emisionDefinicionService.findById(id)
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
		const emisionDefinicion = new EmisionDefinicionDTO(); emisionDefinicion.setFromObject(dataBody);
		this.emisionDefinicionService.add(dataToken.idUsuario, emisionDefinicion)
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
		const emisionDefinicion = new EmisionDefinicionDTO(); emisionDefinicion.setFromObject(dataBody);
		this.emisionDefinicionService.modify(id, dataToken.idUsuario, emisionDefinicion)
			.then(row => res.send(row))
			.catch(next)
	}

	cloneById = (req, res, next) => {
		const id = req.params.id;
		this.emisionDefinicionService.cloneById(id)
			.then(row => res.send(row))
			.catch(next)
	}
	
	delete = (req, res, next) => {
		const id = req.params.id;
		this.emisionDefinicionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
