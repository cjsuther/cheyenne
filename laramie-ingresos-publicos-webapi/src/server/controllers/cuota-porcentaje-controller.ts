import CuotaPorcentaje from '../../domain/entities/cuota-porcentaje';
import CuotaPorcentajeService from '../../domain/services/cuota-porcentaje-service';

export default class CuotaPorcentajeController {

	cuotaPorcentajeService: CuotaPorcentajeService;

	constructor(cuotaPorcentajeService: CuotaPorcentajeService) {
		this.cuotaPorcentajeService = cuotaPorcentajeService;
	}

	get = (req, res, next) => {
		this.cuotaPorcentajeService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.cuotaPorcentajeService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const cuotaPorcentaje = new CuotaPorcentaje(); cuotaPorcentaje.setFromObject(dataBody);
		this.cuotaPorcentajeService.add(cuotaPorcentaje)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const cuotaPorcentaje = new CuotaPorcentaje(); cuotaPorcentaje.setFromObject(dataBody);
		this.cuotaPorcentajeService.modify(id, cuotaPorcentaje)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.cuotaPorcentajeService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
