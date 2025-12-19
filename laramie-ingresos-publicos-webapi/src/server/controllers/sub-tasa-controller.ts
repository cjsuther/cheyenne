import SubTasaDTO from '../../domain/dto/sub-tasa-dto';
import SubTasaFilter from '../../domain/dto/sub-tasa-filter';
import SubTasaService from '../../domain/services/sub-tasa-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class SubTasaController {

	subTasaService: SubTasaService;

	constructor(subTasaService: SubTasaService) {
		this.subTasaService = subTasaService;
	}

	get = (req, res, next) => {
		this.subTasaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let subTasaFilter = new SubTasaFilter();
		subTasaFilter.idTasa = parseInt(req.query.idTasa);
		subTasaFilter.codigo = req.query.codigo;
		subTasaFilter.descripcion = req.query.descripcion;
		subTasaFilter.etiqueta = req.query.etiqueta;
		
		this.subTasaService.listByFilter(subTasaFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.subTasaService.findById(id)
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
		const subTasaDTO = new SubTasaDTO(); subTasaDTO.setFromObject(dataBody);
		this.subTasaService.add(dataToken.idUsuario, subTasaDTO)
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
		const subTasaDTO = new SubTasaDTO(); subTasaDTO.setFromObject(dataBody);
		this.subTasaService.modify(id, dataToken.idUsuario, subTasaDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.subTasaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
