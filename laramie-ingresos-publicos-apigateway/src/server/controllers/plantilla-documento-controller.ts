import PlantillaDocumentoService from '../../domain/services/plantilla-documento-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class PlantillaDocumentoController {

	plantillaDocumentoService: PlantillaDocumentoService;

	constructor(plantillaDocumentoService: PlantillaDocumentoService) {
		this.plantillaDocumentoService = plantillaDocumentoService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.plantillaDocumentoService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByTipoPlantillaDocumento = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idTipoPlantillaDocumento = req.params.idTipoPlantillaDocumento;
		if (!token || !isValidNumber(idTipoPlantillaDocumento, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.plantillaDocumentoService.listByTipoPlantillaDocumento(token, idTipoPlantillaDocumento)
			.then(row => res.send(row))
			.catch(next)
	}

	getByTipoActoProcesal = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idTipoActoProcesal = req.params.idTipoActoProcesal;
		if (!token || !isValidNumber(idTipoActoProcesal, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.plantillaDocumentoService.listByTipoActoProcesal(token, idTipoActoProcesal)
			.then(row => res.send(row))
			.catch(next)
	}

	getById = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.plantillaDocumentoService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.plantillaDocumentoService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.plantillaDocumentoService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.plantillaDocumentoService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
