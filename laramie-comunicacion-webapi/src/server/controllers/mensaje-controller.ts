import Mensaje from '../../domain/entities/mensaje';
import MensajeService from '../../domain/services/mensaje-service';

export default class MensajeController {

	mensajeService: MensajeService;

	constructor(mensajeService: MensajeService) {
		this.mensajeService = mensajeService;
	}

	get = async (req, res, next) => {
		this.mensajeService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.mensajeService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const mensaje = new Mensaje(); mensaje.setFromObject(dataBody);
		this.mensajeService.add(mensaje)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const mensaje = new Mensaje(); mensaje.setFromObject(dataBody);
		this.mensajeService.modify(id, mensaje)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.mensajeService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
