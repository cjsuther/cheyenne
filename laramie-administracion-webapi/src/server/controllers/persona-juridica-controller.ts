import PersonaFilter from '../../domain/dto/persona-filter';
import PersonaJuridicaDTO from '../../domain/dto/persona-juridica-dto';
import PersonaJuridica from '../../domain/entities/persona-juridica';
import PersonaJuridicaService from '../../domain/services/persona-juridica-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class PersonaJuridicaController {

	personaJuridicaService: PersonaJuridicaService;

	constructor(personaJuridicaService: PersonaJuridicaService) {
		this.personaJuridicaService = personaJuridicaService;
	}

	get = (req, res, next) => {
		this.personaJuridicaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let personaFilter = new PersonaFilter();
		personaFilter.numeroDocumento = req.query.numeroDocumento;
		personaFilter.nombre = req.query.nombre;
		personaFilter.etiqueta = req.query.etiqueta;
		
		this.personaJuridicaService.listByFilter(personaFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.personaJuridicaService.findById(id)
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
		const personaJuridicaDTO = new PersonaJuridicaDTO(); personaJuridicaDTO.setFromObject(dataBody);
		this.personaJuridicaService.add(dataToken.idUsuario, personaJuridicaDTO)
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
		const personaJuridicaDTO = new PersonaJuridicaDTO(); personaJuridicaDTO.setFromObject(dataBody);
		this.personaJuridicaService.modify(id, dataToken.idUsuario, personaJuridicaDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.personaJuridicaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
