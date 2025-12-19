import RegistroCivil from '../../domain/entities/registro-civil';
import RegistroCivilService from '../../domain/services/registro-civil-service';

export default class RegistroCivilController {

	registroCivilService: RegistroCivilService;

	constructor(registroCivilService: RegistroCivilService) {
		this.registroCivilService = registroCivilService;
	}

	get = async (req, res, next) => {
		this.registroCivilService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.registroCivilService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const registroCivil = new RegistroCivil(); registroCivil.setFromObject(dataBody);
		this.registroCivilService.add(registroCivil)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const registroCivil = new RegistroCivil(); registroCivil.setFromObject(dataBody);
		this.registroCivilService.modify(id, registroCivil)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.registroCivilService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
