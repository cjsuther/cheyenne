import CertificadoApremioItem from '../../domain/entities/certificado-apremio-item';
import CertificadoApremioItemService from '../../domain/services/certificado-apremio-item-service';

export default class CertificadoApremioItemController {

	certificadoApremioItemService: CertificadoApremioItemService;

	constructor(certificadoApremioItemService: CertificadoApremioItemService) {
		this.certificadoApremioItemService = certificadoApremioItemService;
	}

	get = (req, res, next) => {
		this.certificadoApremioItemService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByCertificadoApremio = (req, res, next) => {
		const idCertificadoApremio = req.params.idCertificadoApremio
		this.certificadoApremioItemService.listByCertificadoApremio(idCertificadoApremio)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.certificadoApremioItemService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const certificadoApremioItem = new CertificadoApremioItem(); certificadoApremioItem.setFromObject(dataBody);
		this.certificadoApremioItemService.add(certificadoApremioItem)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const certificadoApremioItem = new CertificadoApremioItem(); certificadoApremioItem.setFromObject(dataBody);
		this.certificadoApremioItemService.modify(id, certificadoApremioItem)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.certificadoApremioItemService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
