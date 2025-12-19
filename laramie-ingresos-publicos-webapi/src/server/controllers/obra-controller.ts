import Obra from '../../domain/entities/obra';
import ObraService from '../../domain/services/obra-service';

export default class ObraController {

	obraService: ObraService;

	constructor(obraService: ObraService) {
		this.obraService = obraService;
	}

	get = async (req, res, next) => {
		this.obraService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.obraService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const obra = new Obra(); obra.setFromObject(dataBody);
		this.obraService.add(obra)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const obra = new Obra(); obra.setFromObject(dataBody);
		this.obraService.modify(id, obra)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.obraService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
