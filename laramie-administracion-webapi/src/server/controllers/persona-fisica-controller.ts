import PersonaFilter from '../../domain/dto/persona-filter';
import PersonaFisicaDTO from '../../domain/dto/persona-fisica-dto';
import PersonaFisica from '../../domain/entities/persona-fisica';
import PersonaFisicaService from '../../domain/services/persona-fisica-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class PersonaFisicaController {

	personaFisicaService: PersonaFisicaService;

	constructor(personaFisicaService: PersonaFisicaService) {
		this.personaFisicaService = personaFisicaService;
	}

	get = (req, res, next) => {
		this.personaFisicaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let personaFilter = new PersonaFilter();
		personaFilter.numeroDocumento = req.query.numeroDocumento;
		personaFilter.nombre = req.query.nombre;
		personaFilter.etiqueta = req.query.etiqueta;
		
		this.personaFisicaService.listByFilter(personaFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.personaFisicaService.findById(id)
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
		const personaFisicaDTO = new PersonaFisicaDTO(); personaFisicaDTO.setFromObject(dataBody);
		this.personaFisicaService.add(dataToken.idUsuario, personaFisicaDTO)
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
		const personaFisicaDTO = new PersonaFisicaDTO(); personaFisicaDTO.setFromObject(dataBody);
		this.personaFisicaService.modify(id, dataToken.idUsuario, personaFisicaDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.personaFisicaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
