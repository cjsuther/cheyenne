import DeclaracionJuradaComercio from '../../domain/entities/declaracion-jurada-comercio';
import DeclaracionJuradaComercioService from '../../domain/services/declaracion-jurada-comercio-service';

export default class DeclaracionJuradaComercioController {

	declaracionJuradaComercioService: DeclaracionJuradaComercioService;

	constructor(declaracionJuradaComercioService: DeclaracionJuradaComercioService) {
		this.declaracionJuradaComercioService = declaracionJuradaComercioService;
	}

	get = async (req, res, next) => {
		this.declaracionJuradaComercioService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.declaracionJuradaComercioService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const idCuenta = req.params.idCuenta;
		this.declaracionJuradaComercioService.listByCuenta(idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const declaracionJuradaComercio = new DeclaracionJuradaComercio(); declaracionJuradaComercio.setFromObject(dataBody);
		this.declaracionJuradaComercioService.add(declaracionJuradaComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const declaracionJuradaComercio = new DeclaracionJuradaComercio(); declaracionJuradaComercio.setFromObject(dataBody);
		this.declaracionJuradaComercioService.modify(id, declaracionJuradaComercio)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.declaracionJuradaComercioService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
