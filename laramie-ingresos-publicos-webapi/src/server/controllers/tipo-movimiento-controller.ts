import TipoMovimiento from '../../domain/entities/tipo-movimiento';
import TipoMovimientoService from '../../domain/services/tipo-movimiento-service';

export default class TipoMovimientoController {

	tipoMovimientoService: TipoMovimientoService;

	constructor(tipoMovimientoService: TipoMovimientoService) {
		this.tipoMovimientoService = tipoMovimientoService;
	}

	get = async (req, res, next) => {
		this.tipoMovimientoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoMovimientoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByCodigo = async (req, res, next) => {
		const codigo = req.params.codigo;
		this.tipoMovimientoService.findByCodigo(codigo)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoMovimiento = new TipoMovimiento(); tipoMovimiento.setFromObject(dataBody);
		this.tipoMovimientoService.add(tipoMovimiento)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoMovimiento = new TipoMovimiento(); tipoMovimiento.setFromObject(dataBody);
		this.tipoMovimientoService.modify(id, tipoMovimiento)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoMovimientoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
