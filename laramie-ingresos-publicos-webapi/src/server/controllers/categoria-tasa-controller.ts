import CategoriaTasa from '../../domain/entities/categoria-tasa';
import CategoriaTasaService from '../../domain/services/categoria-tasa-service';

export default class CategoriaTasaController {

	categoriaTasaService: CategoriaTasaService;

	constructor(categoriaTasaService: CategoriaTasaService) {
		this.categoriaTasaService = categoriaTasaService;
	}

	get = async (req, res, next) => {
		this.categoriaTasaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.categoriaTasaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const categoriaTasa = new CategoriaTasa(); categoriaTasa.setFromObject(dataBody);
		this.categoriaTasaService.add(categoriaTasa)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const categoriaTasa = new CategoriaTasa(); categoriaTasa.setFromObject(dataBody);
		this.categoriaTasaService.modify(id, categoriaTasa)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.categoriaTasaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
