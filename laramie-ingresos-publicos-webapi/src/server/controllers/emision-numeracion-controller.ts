import EmisionNumeracion from '../../domain/entities/emision-numeracion';
import EmisionNumeracionService from '../../domain/services/emision-numeracion-service';

export default class EmisionNumeracionController {

	emisionNumeracionService: EmisionNumeracionService;

	constructor(emisionNumeracionService: EmisionNumeracionService) {
		this.emisionNumeracionService = emisionNumeracionService;
	}

	get = (req, res, next) => {
		this.emisionNumeracionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.emisionNumeracionService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const emisionNumeracion = new EmisionNumeracion(); emisionNumeracion.setFromObject(dataBody);
		this.emisionNumeracionService.add(emisionNumeracion)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const emisionNumeracion = new EmisionNumeracion(); emisionNumeracion.setFromObject(dataBody);
		this.emisionNumeracionService.modify(id, emisionNumeracion)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.emisionNumeracionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
