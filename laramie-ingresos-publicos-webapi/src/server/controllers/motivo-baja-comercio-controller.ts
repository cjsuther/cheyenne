import MotivoBajaComercio from '../../domain/entities/motivo-baja-comercio';
import MotivoBajaComercioService from '../../domain/services/motivo-baja-comercio-service';

export default class MotivoBajaComercioController {

	motivoBajaComercioService: MotivoBajaComercioService;

	constructor(motivoBajaComercioService: MotivoBajaComercioService) {
		this.motivoBajaComercioService = motivoBajaComercioService;
	}

	get = async (req, res, next) => {
		this.motivoBajaComercioService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.motivoBajaComercioService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const motivoBajaComercio = new MotivoBajaComercio(); motivoBajaComercio.setFromObject(dataBody);
		this.motivoBajaComercioService.add(motivoBajaComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const motivoBajaComercio = new MotivoBajaComercio(); motivoBajaComercio.setFromObject(dataBody);
		this.motivoBajaComercioService.modify(id, motivoBajaComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.motivoBajaComercioService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
