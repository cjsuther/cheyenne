import TipoInstrumento from '../../domain/entities/tipo-instrumento';
import TipoInstrumentoService from '../../domain/services/tipo-instrumento-service';

export default class TipoInstrumentoController {

	tipoInstrumentoService: TipoInstrumentoService;

	constructor(tipoInstrumentoService: TipoInstrumentoService) {
		this.tipoInstrumentoService = tipoInstrumentoService;
	}

	get = async (req, res, next) => {
		this.tipoInstrumentoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoInstrumentoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoInstrumento = new TipoInstrumento(); tipoInstrumento.setFromObject(dataBody);
		this.tipoInstrumentoService.add(tipoInstrumento)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoInstrumento = new TipoInstrumento(); tipoInstrumento.setFromObject(dataBody);
		this.tipoInstrumentoService.modify(id, tipoInstrumento)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoInstrumentoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
