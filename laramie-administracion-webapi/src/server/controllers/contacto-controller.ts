import Contacto from '../../domain/entities/contacto';
import ContactoService from '../../domain/services/contacto-service';

export default class ContactoController {

	contactoService: ContactoService;

	constructor(contactoService: ContactoService) {
		this.contactoService = contactoService;
	}

	get = (req, res, next) => {
		this.contactoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByEntidad = (req, res, next) => {
		const entidad = req.params.entidad;
		const idEntidad = req.params.idEntidad;
		this.contactoService.listByEntidad(entidad, idEntidad)
		  .then(data => res.send(data))
		  .catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.contactoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const contacto = new Contacto(); contacto.setFromObject(dataBody);
		this.contactoService.add(contacto)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const contacto = new Contacto(); contacto.setFromObject(dataBody);
		this.contactoService.modify(id, contacto)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.contactoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
