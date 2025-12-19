import TipoConstruccionFuneraria from '../../domain/entities/tipo-construccion-funeraria';
import TipoConstruccionFunerariaService from '../../domain/services/tipo-construccion-funeraria-service';

export default class TipoConstruccionFunerariaController {

	tipoConstruccionFunerariaService: TipoConstruccionFunerariaService;

	constructor(tipoConstruccionFunerariaService: TipoConstruccionFunerariaService) {
		this.tipoConstruccionFunerariaService = tipoConstruccionFunerariaService;
	}

	get = async (req, res, next) => {
		this.tipoConstruccionFunerariaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoConstruccionFunerariaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoConstruccionFuneraria = new TipoConstruccionFuneraria(); tipoConstruccionFuneraria.setFromObject(dataBody);
		this.tipoConstruccionFunerariaService.add(tipoConstruccionFuneraria)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoConstruccionFuneraria = new TipoConstruccionFuneraria(); tipoConstruccionFuneraria.setFromObject(dataBody);
		this.tipoConstruccionFunerariaService.modify(id, tipoConstruccionFuneraria)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoConstruccionFunerariaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
