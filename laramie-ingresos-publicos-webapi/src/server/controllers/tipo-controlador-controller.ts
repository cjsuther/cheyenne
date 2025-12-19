import TipoControlador from '../../domain/entities/tipo-controlador';
import TipoControladorService from '../../domain/services/tipo-controlador-service';

export default class TipoControladorController {

	tipoControladorService: TipoControladorService;

	constructor(tipoControladorService: TipoControladorService) {
		this.tipoControladorService = tipoControladorService;
	}

	get = (req, res, next) => {
		this.tipoControladorService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.tipoControladorService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const tipoControlador = new TipoControlador(); tipoControlador.setFromObject(dataBody);
		this.tipoControladorService.add(tipoControlador)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoControlador = new TipoControlador(); tipoControlador.setFromObject(dataBody);
		this.tipoControladorService.modify(id, tipoControlador)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.tipoControladorService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
