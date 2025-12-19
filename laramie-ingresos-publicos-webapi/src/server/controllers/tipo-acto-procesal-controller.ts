import TipoActoProcesal from '../../domain/entities/tipo-acto-procesal';
import TipoActoProcesalService from '../../domain/services/tipo-acto-procesal-service';

export default class TipoActoProcesalController {

	tipoActoProcesalService: TipoActoProcesalService;

	constructor(tipoActoProcesalService: TipoActoProcesalService) {
		this.tipoActoProcesalService = tipoActoProcesalService;
	}

	get = (req, res, next) => {
		this.tipoActoProcesalService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.tipoActoProcesalService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const tipoActoProcesal = new TipoActoProcesal(); tipoActoProcesal.setFromObject(dataBody);
		this.tipoActoProcesalService.add(tipoActoProcesal)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoActoProcesal = new TipoActoProcesal(); tipoActoProcesal.setFromObject(dataBody);
		this.tipoActoProcesalService.modify(id, tipoActoProcesal)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.tipoActoProcesalService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}
	
	putPlantillasDocumentos = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const plantillasDocumentos = dataBody.plantillasDocumentos;
		this.tipoActoProcesalService.modifyPlantillasDocumentos(id, plantillasDocumentos)
		  .then(row => res.send(row))
		  .catch(next)
	}

}
