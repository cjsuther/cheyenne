import TipoRecargoDescuento from '../../domain/entities/tipo-recargo-descuento';
import TipoRecargoDescuentoService from '../../domain/services/tipo-recargo-descuento-service';

export default class TipoRecargoDescuentoController {

	tipoRecargoDescuentoService: TipoRecargoDescuentoService;

	constructor(tipoRecargoDescuentoService: TipoRecargoDescuentoService) {
		this.tipoRecargoDescuentoService = tipoRecargoDescuentoService;
	}

	get = async (req, res, next) => {
		this.tipoRecargoDescuentoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoRecargoDescuentoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoRecargoDescuento = new TipoRecargoDescuento(); tipoRecargoDescuento.setFromObject(dataBody);
		this.tipoRecargoDescuentoService.add(tipoRecargoDescuento)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoRecargoDescuento = new TipoRecargoDescuento(); tipoRecargoDescuento.setFromObject(dataBody);
		this.tipoRecargoDescuentoService.modify(id, tipoRecargoDescuento)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoRecargoDescuentoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
