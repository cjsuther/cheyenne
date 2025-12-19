import TipoRelacionCertificadoApremioPersona from '../../domain/entities/tipo-relacion-certificado-apremio-persona';
import TipoRelacionCertificadoApremioPersonaService from '../../domain/services/tipo-relacion-certificado-apremio-persona-service';

export default class TipoRelacionCertificadoApremioPersonaController {

	tipoRelacionCertificadoApremioPersonaService: TipoRelacionCertificadoApremioPersonaService;

	constructor(tipoRelacionCertificadoApremioPersonaService: TipoRelacionCertificadoApremioPersonaService) {
		this.tipoRelacionCertificadoApremioPersonaService = tipoRelacionCertificadoApremioPersonaService;
	}

	get = (req, res, next) => {
		this.tipoRelacionCertificadoApremioPersonaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.tipoRelacionCertificadoApremioPersonaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const tipoRelacionCertificadoApremioPersona = new TipoRelacionCertificadoApremioPersona(); tipoRelacionCertificadoApremioPersona.setFromObject(dataBody);
		this.tipoRelacionCertificadoApremioPersonaService.add(tipoRelacionCertificadoApremioPersona)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoRelacionCertificadoApremioPersona = new TipoRelacionCertificadoApremioPersona(); tipoRelacionCertificadoApremioPersona.setFromObject(dataBody);
		this.tipoRelacionCertificadoApremioPersonaService.modify(id, tipoRelacionCertificadoApremioPersona)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.tipoRelacionCertificadoApremioPersonaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
