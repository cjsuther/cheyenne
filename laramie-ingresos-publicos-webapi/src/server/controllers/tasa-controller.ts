import TasaDTO from '../../domain/dto/tasa-dto';
import TasaFilter from '../../domain/dto/tasa-filter';
import TasaService from '../../domain/services/tasa-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class TasaController {

	tasaService: TasaService;

	constructor(tasaService: TasaService) {
		this.tasaService = tasaService;
	}

	get = (req, res, next) => {
		this.tasaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let tasaFilter = new TasaFilter();
		tasaFilter.codigo = req.query.codigo;
		tasaFilter.descripcion = req.query.descripcion;
		tasaFilter.etiqueta = req.query.etiqueta;
		
		this.tasaService.listByFilter(tasaFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.tasaService.findById(id)
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
		const tasaDTO = new TasaDTO(); tasaDTO.setFromObject(dataBody);
		this.tasaService.add(dataToken.idUsuario, tasaDTO)
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
		const tasaDTO = new TasaDTO(); tasaDTO.setFromObject(dataBody);
		this.tasaService.modify(id, dataToken.idUsuario, tasaDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.tasaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
