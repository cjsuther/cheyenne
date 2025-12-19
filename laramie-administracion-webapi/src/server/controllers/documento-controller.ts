import Documento from '../../domain/entities/documento';
import DocumentoService from '../../domain/services/documento-service';

export default class DocumentoController {

	documentoService: DocumentoService;

	constructor(documentoService: DocumentoService) {
		this.documentoService = documentoService;
	}

	get = (req, res, next) => {
		this.documentoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByPersona = (req, res, next) => {
		const idTipoPersona = req.params.idTipoPersona;
		const idPersona = req.params.idPersona;
		this.documentoService.listByPersona(idTipoPersona, idPersona)
		  .then(data => res.send(data))
		  .catch(next)
	  }

	getById = (req, res, next) => {
		const id = req.params.id;
		this.documentoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const documento = new Documento(); documento.setFromObject(dataBody);
		this.documentoService.add(documento)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const documento = new Documento(); documento.setFromObject(dataBody);
		this.documentoService.modify(id, documento)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.documentoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
