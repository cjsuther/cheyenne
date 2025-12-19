import Jurisdiccion from '../../domain/entities/jurisdiccion';
import JurisdiccionService from '../../domain/services/jurisdiccion-service';

export default class JurisdiccionController {

	jurisdiccionService: JurisdiccionService;

	constructor(jurisdiccionService: JurisdiccionService) {
		this.jurisdiccionService = jurisdiccionService;
	}

	get = async (req, res, next) => {
		this.jurisdiccionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.jurisdiccionService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const jurisdiccion = new Jurisdiccion(); jurisdiccion.setFromObject(dataBody);
		this.jurisdiccionService.add(jurisdiccion)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const jurisdiccion = new Jurisdiccion(); jurisdiccion.setFromObject(dataBody);
		this.jurisdiccionService.modify(id, jurisdiccion)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.jurisdiccionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
