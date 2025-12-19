import MotivoBajaRubroComercio from '../../domain/entities/motivo-baja-rubro-comercio';
import MotivoBajaRubroComercioService from '../../domain/services/motivo-baja-rubro-comercio-service';

export default class MotivoBajaRubroComercioController {

	motivoBajaRubroComercioService: MotivoBajaRubroComercioService;

	constructor(motivoBajaRubroComercioService: MotivoBajaRubroComercioService) {
		this.motivoBajaRubroComercioService = motivoBajaRubroComercioService;
	}

	get = async (req, res, next) => {
		this.motivoBajaRubroComercioService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.motivoBajaRubroComercioService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const motivoBajaRubroComercio = new MotivoBajaRubroComercio(); motivoBajaRubroComercio.setFromObject(dataBody);
		this.motivoBajaRubroComercioService.add(motivoBajaRubroComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const motivoBajaRubroComercio = new MotivoBajaRubroComercio(); motivoBajaRubroComercio.setFromObject(dataBody);
		this.motivoBajaRubroComercioService.modify(id, motivoBajaRubroComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.motivoBajaRubroComercioService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
