import ConvenioParametro from '../../domain/entities/convenio-parametro';
import ConvenioParametroService from '../../domain/services/convenio-parametro-service';

export default class ConvenioParametroController {

	convenioParametroService: ConvenioParametroService;

	constructor(convenioParametroService: ConvenioParametroService) {
		this.convenioParametroService = convenioParametroService;
	}

	get = async (req, res, next) => {
		this.convenioParametroService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.convenioParametroService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const convenioParametro = new ConvenioParametro(); convenioParametro.setFromObject(dataBody);
		this.convenioParametroService.add(convenioParametro)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const convenioParametro = new ConvenioParametro(); convenioParametro.setFromObject(dataBody);
		this.convenioParametroService.modify(id, convenioParametro)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.convenioParametroService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
