import RegistroContableLote from '../../domain/entities/registro-contable-lote';
import RegistroContableLoteService from '../../domain/services/registro-contable-lote-service';

export default class RegistroContableLoteController {

	registroContableLoteService: RegistroContableLoteService;

	constructor(registroContableLoteService: RegistroContableLoteService) {
		this.registroContableLoteService = registroContableLoteService;
	}

	get = async (req, res, next) => {
		this.registroContableLoteService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getDetalle = async (req, res, next) => {
		const id = req.params.id;
		this.registroContableLoteService.listDetalle(id)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.registroContableLoteService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const registroContableLote = new RegistroContableLote(); registroContableLote.setFromObject(dataBody);
		this.registroContableLoteService.add(registroContableLote)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const registroContableLote = new RegistroContableLote(); registroContableLote.setFromObject(dataBody);
		this.registroContableLoteService.modify(id, registroContableLote)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.registroContableLoteService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
