import TasaVencimiento from '../../domain/entities/tasa-vencimiento';
import TasaVencimientoService from '../../domain/services/tasa-vencimiento-service';

export default class TasaVencimientoController {

	tasaVencimientoService: TasaVencimientoService;

	constructor(tasaVencimientoService: TasaVencimientoService) {
		this.tasaVencimientoService = tasaVencimientoService;
	}

	get = (req, res, next) => {
		this.tasaVencimientoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.tasaVencimientoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const tasaVencimiento = new TasaVencimiento(); tasaVencimiento.setFromObject(dataBody);
		this.tasaVencimientoService.add(tasaVencimiento)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tasaVencimiento = new TasaVencimiento(); tasaVencimiento.setFromObject(dataBody);
		this.tasaVencimientoService.modify(id, tasaVencimiento)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.tasaVencimientoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
