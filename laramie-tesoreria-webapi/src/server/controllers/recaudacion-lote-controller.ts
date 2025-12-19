import RecaudacionLote from '../../domain/entities/recaudacion-lote';
import RecaudacionLoteService from '../../domain/services/recaudacion-lote-service';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class RecaudacionLoteController {

	recaudacionLoteService: RecaudacionLoteService;

	constructor(recaudacionLoteService: RecaudacionLoteService) {
		this.recaudacionLoteService = recaudacionLoteService;
	}

	get = async (req, res, next) => {
		this.recaudacionLoteService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getDetalle = async (req, res, next) => {
		const id = req.params.id;
		this.recaudacionLoteService.listDetalle(id)
			.then(data => res.send(data))
			.catch(next)
	}

	getControl = async (req, res, next) => {
		this.recaudacionLoteService.listControl()
			.then(data => res.send(data))
			.catch(next)
	}

	getConciliacion = async (req, res, next) => {
		this.recaudacionLoteService.listConciliacion()
			.then(data => res.send(data))
			.catch(next)
	}

	getIngresosPublicos = async (req, res, next) => {
		this.recaudacionLoteService.listIngresosPublicos()
			.then(data => res.send(data))
			.catch(next)
	}

	getRegistroContable = async (req, res, next) => {
		this.recaudacionLoteService.listRegistroContable()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.recaudacionLoteService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const recaudacionLote = new RecaudacionLote(); recaudacionLote.setFromObject(dataBody);
		this.recaudacionLoteService.add(recaudacionLote)
			.then(row => res.send(row))
			.catch(next)
	}

	postImportacionPreview = async (req, res, next) => {
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
		let idRecaudadora:number = 0;
		let nombre:string = "";
		let path:string = "";	
		try {
			idRecaudadora = dataBody.idRecaudadora;
			nombre = dataBody.nombre;
			path = dataBody.path;
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}
		
		this.recaudacionLoteService.addImportacionPreview(dataToken.idUsuario, idRecaudadora, nombre, path)
			.then(row => res.send(row))
			.catch(next)
	}

	postImportacionConfirmacion = async (req, res, next) => {
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
		let idRecaudadora:number = 0;
		let nombre:string = "";
		let path:string = "";	
		try {
			idRecaudadora = dataBody.idRecaudadora;
			nombre = dataBody.nombre;
			path = dataBody.path;
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}
		
		this.recaudacionLoteService.addImportacionConfirmacion(dataToken.idUsuario, idRecaudadora, nombre, path)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const recaudacionLote = new RecaudacionLote(); recaudacionLote.setFromObject(dataBody);
		this.recaudacionLoteService.modify(id, recaudacionLote)
			.then(row => res.send(row))
			.catch(next)
	}

	putControl = async (req, res, next) => {
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

		const id = req.params.id;
		let importeNeto: number = 0;
		const dataBody = {...req.body};
		try {
			importeNeto = parseFloat(dataBody.importeNeto);
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}

		this.recaudacionLoteService.modifyControl(dataToken.idUsuario, id, importeNeto)
			.then(row => res.send(row))
			.catch(next)
	}

	putConciliacionManual = async (req, res, next) => {
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

		const idRecaudacion = req.params.idRecaudacion;
		this.recaudacionLoteService.modifyConciliacionManual(dataToken.idUsuario, idRecaudacion)
			.then(row => res.send(row))
			.catch(next)
	}

	putIngresosPublicos = async (req, res, next) => {
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
		let idsRecaudadora: number[] = [];
		try {
			idsRecaudadora = dataBody.idsRecaudadora.map(x => parseInt(x.toString()));
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}

		this.recaudacionLoteService.modifyIngresosPublicos(token, dataToken.idUsuario, idsRecaudadora)
			.then(row => res.send(row))
			.catch(next)
	}

	putRegistroContable = async (req, res, next) => {
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
		let idsRecaudadora: number[] = [];
		try {
			idsRecaudadora = dataBody.idsRecaudadora.map(x => parseInt(x.toString()));
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}

		this.recaudacionLoteService.modifyRegistroContable(token, dataToken.idUsuario, idsRecaudadora)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.recaudacionLoteService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
