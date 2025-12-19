import CuentaCorrienteItem from '../../domain/entities/cuenta-corriente-item';
import CuentaCorrienteItemRecibo from '../../domain/dto/cuenta-corriente-item-recibo';
import CuentaCorrienteItemFilter from '../../domain/dto/cuenta-corriente-item-filter';
import CuentaCorrienteItemService from '../../domain/services/cuenta-corriente-item-service';
import CuentaCorrienteItemPagoACuenta from '../../domain/dto/cuenta-corriente-item-pago-acuenta';
import PagoReciboEspecial from '../../domain/dto/pago-recibo-especial';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';

export default class CuentaCorrienteItemController {

	cuentaCorrienteItemService: CuentaCorrienteItemService;

	constructor(cuentaCorrienteItemService: CuentaCorrienteItemService) {
		this.cuentaCorrienteItemService = cuentaCorrienteItemService;
	}

	get = (req, res, next) => {
		this.cuentaCorrienteItemService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let cuentaCorrienteItemFilter = new CuentaCorrienteItemFilter();
		cuentaCorrienteItemFilter.idCuenta = parseInt(req.query.idCuenta);
		cuentaCorrienteItemFilter.incluyePlanes = (req.query.incluyePlanes === "true");
		cuentaCorrienteItemFilter.fechaDesde = (req.query.fechaDesde.length > 0) ? new Date(req.query.fechaDesde) : null;
		cuentaCorrienteItemFilter.fechaHasta = (req.query.fechaHasta.length > 0) ? new Date(req.query.fechaHasta) : null;
		cuentaCorrienteItemFilter.fechaDeuda = (req.query.fechaDeuda.length > 0) ? new Date(req.query.fechaDeuda) : null;

		this.cuentaCorrienteItemService.listByFilter(cuentaCorrienteItemFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const idCuenta = req.params.idCuenta;
		this.cuentaCorrienteItemService.listByCuenta(idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getByContribuyente = (req, res, next) => {
		const idContribuyente = req.params.idContribuyente;
		this.cuentaCorrienteItemService.listByContribuyente(idContribuyente)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCredito = (req, res, next) => {
		const idCuenta = parseInt(req.params.idCuenta);
		this.cuentaCorrienteItemService.listByCredito(idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getByDeuda = (req, res, next) => {
		const idCuenta = parseInt(req.params.idCuenta);
		this.cuentaCorrienteItemService.listByDeuda(idCuenta, true)
			.then(data => res.send(data))
			.catch(next)
	}

	getByDeudaVencimiento = (req, res, next) => {
		const idCuenta = parseInt(req.params.idCuenta);
		const fechaVencimiento = new Date(req.params.fechaVencimiento);
		this.cuentaCorrienteItemService.listByDeuda(idCuenta, true, fechaVencimiento)
			.then(data => res.send(data))
			.catch(next)
	}

	getByPagoACuenta = (req, res, next) => {
		const dataBody = {...req.body};
		const cuentaCorrienteItem = new CuentaCorrienteItemPagoACuenta(); cuentaCorrienteItem.setFromObject(dataBody);
		cuentaCorrienteItem.fechaVencimiento = new Date(cuentaCorrienteItem.fechaVencimiento);
		this.cuentaCorrienteItemService.listByPagoACuenta(cuentaCorrienteItem)
			.then(row => res.send(row))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.cuentaCorrienteItemService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const cuentaCorrienteItem = new CuentaCorrienteItem(); cuentaCorrienteItem.setFromObject(dataBody);
		this.cuentaCorrienteItemService.add(cuentaCorrienteItem)
			.then(row => res.send(row))
			.catch(next)
	}

	postReciboComun = (req, res, next) => {
		const dataBody = {...req.body};
		const idCuenta = dataBody.idCuenta;
		const fechaVencimiento = new Date(dataBody.fechaVencimiento);
		const items = dataBody.items.map(row => {
			const item = new CuentaCorrienteItemRecibo();
			item.setFromObject(row);
			return item;
		});
		this.cuentaCorrienteItemService.addReciboComun(idCuenta, fechaVencimiento, items)
		  .then(row => res.send(row))
		  .catch(next)
	}

	postPagoReciboEspecial = (req, res, next) => {
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
		const pagoReciboEspecial = new PagoReciboEspecial(); pagoReciboEspecial.setFromObject(dataBody);
		this.cuentaCorrienteItemService.addPagoReciboEspecial(dataToken.idUsuario, pagoReciboEspecial)
		  .then(row => res.send(row))
		  .catch(next)
	}

	postByPagoACuenta = (req, res, next) => {
		const dataBody = {...req.body};
		const cuentaCorrienteItem = new CuentaCorrienteItemPagoACuenta(); cuentaCorrienteItem.setFromObject(dataBody);
		cuentaCorrienteItem.fechaVencimiento = new Date(cuentaCorrienteItem.fechaVencimiento);
		this.cuentaCorrienteItemService.addByPagoACuenta(cuentaCorrienteItem)
			.then(row => res.send(row))
			.catch(next)
	}

	postCredito = (req, res, next) => {
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
		const idCuenta = dataBody.idCuenta;
		const numeroPartidaOrigen = dataBody.numeroPartidaOrigen;
		const numeroPartidaDestino = dataBody.numeroPartidaDestino;
		const detalle = dataBody.detalle;
		this.cuentaCorrienteItemService.addCredito(dataToken.idUsuario, idCuenta, numeroPartidaOrigen, numeroPartidaDestino, detalle)
		  .then(row => res.send(row))
		  .catch(next)
	}

	postDebitoCredito = (req, res, next) => {
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
		const idCuenta = dataBody.idCuenta;
		let cuentaCorrienteItems: Array<CuentaCorrienteItem> = [];
		dataBody.cuentaCorrienteItems.forEach(item => {
			let cuentaCorrienteItem = new CuentaCorrienteItem(); cuentaCorrienteItem.setFromObject(item);
			cuentaCorrienteItems.push(cuentaCorrienteItem);
		});
		this.cuentaCorrienteItemService.addByDebitoCredito(dataToken.idUsuario, idCuenta, cuentaCorrienteItems)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const cuentaCorrienteItem = new CuentaCorrienteItem(); cuentaCorrienteItem.setFromObject(dataBody);
		this.cuentaCorrienteItemService.modify(id, cuentaCorrienteItem)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.cuentaCorrienteItemService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
