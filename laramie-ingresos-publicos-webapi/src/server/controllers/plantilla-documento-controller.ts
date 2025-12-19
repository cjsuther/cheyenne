import PlantillaDocumento from '../../domain/entities/plantilla-documento';
import PlantillaDocumentoService from '../../domain/services/plantilla-documento-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class PlantillaDocumentoController {

	plantillaDocumentoService: PlantillaDocumentoService;

	constructor(plantillaDocumentoService: PlantillaDocumentoService) {
		this.plantillaDocumentoService = plantillaDocumentoService;
	}

	get = (req, res, next) => {
		this.plantillaDocumentoService.list()
			.then(data => res.send(data))
			.catch(next)
	}
	
	getByTipoPlantillaDocumento = (req, res, next) => {
		const idTipoPlantillaDocumento = req.params.idTipoPlantillaDocumento;
		this.plantillaDocumentoService.listByTipoPlantillaDocumento(idTipoPlantillaDocumento)
			.then(row => res.send(row))
			.catch(next)
	}

	getByTipoActoProcesal = (req, res, next) => {
		const idTipoActoProcesal = req.params.idTipoActoProcesal;
		this.plantillaDocumentoService.listByTipoActoProcesal(idTipoActoProcesal)
			.then(row => res.send(row))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.plantillaDocumentoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new UnauthorizedError('No se pudo obtener información del Token'));
			return;
		}

		const dataBody = {...req.body};
		const archivo = new PlantillaDocumento(); archivo.setFromObject(dataBody);
		this.plantillaDocumentoService.add(dataToken.idUsuario, archivo)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const plantillaDocumento = new PlantillaDocumento(); plantillaDocumento.setFromObject(dataBody);
		this.plantillaDocumentoService.modify(id, plantillaDocumento)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.plantillaDocumentoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
