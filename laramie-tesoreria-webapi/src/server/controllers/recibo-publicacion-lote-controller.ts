import ReciboPublicacionLote from '../../domain/entities/recibo-publicacion-lote';
import ReciboPublicacionLoteService from '../../domain/services/recibo-publicacion-lote-service';
import ReciboPublicacionService from '../../domain/services/recibo-publicacion-service';

export default class ReciboPublicacionLoteController {

	reciboPublicacionLoteService: ReciboPublicacionLoteService;
	reciboPublicacionService: ReciboPublicacionService;

	constructor(reciboPublicacionLoteService: ReciboPublicacionLoteService,
				reciboPublicacionService: ReciboPublicacionService
	) {
		this.reciboPublicacionLoteService = reciboPublicacionLoteService;
		this.reciboPublicacionService = reciboPublicacionService;
	}

	get = async (req, res, next) => {
		this.reciboPublicacionLoteService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.reciboPublicacionLoteService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getReciboByNumero = async (req, res, next) => {
		const codigoDelegacion = req.params.codigoDelegacion;
		const numeroRecibo = req.params.numeroRecibo;
		this.reciboPublicacionService.findByNumero(codigoDelegacion, numeroRecibo)
			.then(row => res.send(row))
			.catch(next)
	}

	getReciboReciboByCodigoBarrasCliente = async (req, res, next) => {
		const codigoBarrasCliente = req.params.codigoBarrasCliente;
		this.reciboPublicacionService.findByCodigoBarrasCliente(codigoBarrasCliente)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const reciboPublicacionLote = new ReciboPublicacionLote(); reciboPublicacionLote.setFromObject(dataBody);
		this.reciboPublicacionLoteService.add(reciboPublicacionLote)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const reciboPublicacionLote = new ReciboPublicacionLote(); reciboPublicacionLote.setFromObject(dataBody);
		this.reciboPublicacionLoteService.modify(id, reciboPublicacionLote)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.reciboPublicacionLoteService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
