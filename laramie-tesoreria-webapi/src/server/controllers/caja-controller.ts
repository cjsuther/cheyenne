import MovimientoCobranzaDto from '../../domain/dto/movimiento-cobranza-dto';
import Caja from '../../domain/entities/caja';
import CajaService from '../../domain/services/caja-service';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class CajaController {

	cajaService: CajaService;

	constructor(cajaService: CajaService) {
		this.cajaService = cajaService;
	}

	get = async (req, res, next) => {
		this.cajaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByDependencia = async (req, res, next) => {
		const idDependencia = req.params.idDependencia;
		this.cajaService.listByDependencia(idDependencia)
			.then(data => res.send(data))
			.catch(next)
	}

	getCierreTesoreria = async (req, res, next) => {
		this.cajaService.listCierreTesoreria()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.cajaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByUsuario = async (req, res, next) => {
		const idUsuario = req.params.idUsuario;
		this.cajaService.findByUsuario(idUsuario)
			.then(row => res.send(row))
			.catch(next)
	}

	getResumenById = async (req, res, next) => {
		const id = req.params.id;
		this.cajaService.findResumenById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getResumenByCajaAsignacion = async (req, res, next) => {
		const idCajaAsignacion = req.params.idCajaAsignacion;
		this.cajaService.findResumenByCajaAsignacion(idCajaAsignacion)
			.then(row => res.send(row))
			.catch(next)
	}

	getCajaAsignacion = async (req, res, next) => {
		this.cajaService.listCajaAsignacion()
			.then(row => res.send(row))
			.catch(next)
	}

	getCajaAsignacionByIdCaja = async (req, res, next) => {
		const idCaja = req.params.idCaja;
		this.cajaService.listCajaAsignacionByIdCaja(idCaja)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const caja = new Caja(); caja.setFromObject(dataBody);
		this.cajaService.add(caja)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const caja = new Caja(); caja.setFromObject(dataBody);
		this.cajaService.modify(id, caja)
			.then(row => res.send(row))
			.catch(next)
	}

	putApertura = async (req, res, next) => {
		let id = 0;
		let idUsuario = 0;
		const dataBody = {...req.body};
		try {
			id = parseInt(req.params.id);
			idUsuario = parseInt(dataBody.idUsuario);
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}
		
		this.cajaService.modifyApertura(id, idUsuario)
			.then(row => res.send(row))
			.catch(next)
	}

	putCierre = async (req, res, next) => {
		let id = 0;
		try {
			id = parseInt(req.params.id);
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}

		this.cajaService.modifyCierre(id)
			.then(row => res.send(row))
			.catch(next)
	}

	putMovimientoCobranza = async (req, res, next) => {
		let id = 0;
		let data = null;
		const dataBody = {...req.body};
		try {
			id = parseInt(req.params.id);
			data = new MovimientoCobranzaDto();
			data.setFromObject(dataBody);
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}
		
		this.cajaService.modifyMovimientoCobranza(id, data)
			.then(row => res.send(row))
			.catch(next)
	}

	putMovimientoRetiro = async (req, res, next) => {
		let id = 0;
		let importe = 0;
		let observacion = "";
		const dataBody = {...req.body};
		try {
			id = parseInt(req.params.id);
			importe = parseFloat(dataBody.importe);
			observacion = dataBody.observacion??"";
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}

		this.cajaService.modifyMovimientoRetiro(id, importe, observacion)
			.then(row => res.send(row))
			.catch(next)
	}

	putMovimientoIngreso = async (req, res, next) => {
		let id = 0;
		let importe = 0;
		let observacion = "";
		const dataBody = {...req.body};
		try {
			id = parseInt(req.params.id);
			importe = parseFloat(dataBody.importe);
			observacion = dataBody.observacion??"";
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}

		this.cajaService.modifyMovimientoIngreso(id, importe, observacion)
			.then(row => res.send(row))
			.catch(next)
	}

	deleteMovimiento = async (req, res, next) => {
		let idMovimientoCaja = 0;
		try {
			idMovimientoCaja = parseInt(req.params.idMovimientoCaja);
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}

		this.cajaService.removeMovimiento(idMovimientoCaja)
			.then(id => res.send(id))
			.catch(next)
	}

	putCierreTesoreria = async (req, res, next) => {
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
		let idsCajaAsignacion: number[] = [];
		try {
			idsCajaAsignacion = dataBody.idsCajaAsignacion.map(x => parseInt(x.toString()));
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}

		this.cajaService.modifyCierreTesoreria(dataToken.idUsuario, idsCajaAsignacion)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.cajaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
