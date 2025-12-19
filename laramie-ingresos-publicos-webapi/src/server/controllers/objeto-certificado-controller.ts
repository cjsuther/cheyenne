import ObjetoCertificado from '../../domain/entities/objeto-certificado';
import ObjetoCertificadoService from '../../domain/services/objeto-certificado-service';

export default class ObjetoCertificadoController {

	objetoCertificadoService: ObjetoCertificadoService;

	constructor(objetoCertificadoService: ObjetoCertificadoService) {
		this.objetoCertificadoService = objetoCertificadoService;
	}

	get = async (req, res, next) => {
		this.objetoCertificadoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.objetoCertificadoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const objetoCertificado = new ObjetoCertificado(); objetoCertificado.setFromObject(dataBody);
		this.objetoCertificadoService.add(objetoCertificado)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const objetoCertificado = new ObjetoCertificado(); objetoCertificado.setFromObject(dataBody);
		this.objetoCertificadoService.modify(id, objetoCertificado)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.objetoCertificadoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
