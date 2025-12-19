import CuentaCorrienteItemRecibo from '../../domain/dto/cuenta-corriente-item-recibo';
import PagoContadoDefinicionDTO from '../../domain/dto/pago-contado-definicion-dto';
import PagoContadoDefinicionFilter from '../../domain/dto/pago-contado-definicion-filter';
import PagoContadoDefinicionService from '../../domain/services/pago-contado-definicion-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class PagoContadoDefinicionController {

	pagoContadoDefinicionService: PagoContadoDefinicionService;

	constructor(pagoContadoDefinicionService: PagoContadoDefinicionService) {
		this.pagoContadoDefinicionService = pagoContadoDefinicionService;
	}

	get = async (req, res, next) => {
		this.pagoContadoDefinicionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let pagoContadoDefinicionFilter = new PagoContadoDefinicionFilter();
		pagoContadoDefinicionFilter.idTipoPlanPago = parseInt(req.query.idTipoPlanPago);
		pagoContadoDefinicionFilter.idTipoTributo = parseInt(req.query.idTipoTributo);
		pagoContadoDefinicionFilter.idTasaPagoContado = parseInt(req.query.idTasaPagoContado);
		pagoContadoDefinicionFilter.idSubTasaPagoContado = parseInt(req.query.idSubTasaPagoContado);
		pagoContadoDefinicionFilter.idEstadoPagoContadoDefinicion = parseInt(req.query.idEstadoPagoContadoDefinicion);
		pagoContadoDefinicionFilter.fechaDesde = (req.query.fechaDesde.length > 0) ? new Date(req.query.fechaDesde) : null;
		pagoContadoDefinicionFilter.fechaHasta = (req.query.fechaHasta.length > 0) ? new Date(req.query.fechaHasta) : null;
		pagoContadoDefinicionFilter.descripcion = req.query.descripcion;
		pagoContadoDefinicionFilter.etiqueta = req.query.etiqueta;
		
		this.pagoContadoDefinicionService.listByFilter(pagoContadoDefinicionFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const idCuenta = req.params.idCuenta;
		const dataBody = {...req.body};
		const items = dataBody.items.map(row => {
			const item = new CuentaCorrienteItemRecibo();
			item.setFromObject(row);
			return item;
		});
		this.pagoContadoDefinicionService.listByCuenta(idCuenta, items)
		  .then(row => res.send(row))
		  .catch(next)
	}

	getByCuotas = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const idCuenta = dataBody.idCuenta;
		const items = dataBody.items.map(row => {
			const item = new CuentaCorrienteItemRecibo();
			item.setFromObject(row);
			return item;
		});
		this.pagoContadoDefinicionService.listByCuotas(id, idCuenta, items)
		  .then(row => res.send(row))
		  .catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.pagoContadoDefinicionService.findById(id)
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
		const pagoContadoDefinicionDTO = new PagoContadoDefinicionDTO(); pagoContadoDefinicionDTO.setFromObject(dataBody);
		this.pagoContadoDefinicionService.add(dataToken.idUsuario, pagoContadoDefinicionDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
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
		const dataBody = {...req.body};
		const pagoContadoDefinicionDTO = new PagoContadoDefinicionDTO(); pagoContadoDefinicionDTO.setFromObject(dataBody);
		this.pagoContadoDefinicionService.modify(id, dataToken.idUsuario, pagoContadoDefinicionDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.pagoContadoDefinicionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
