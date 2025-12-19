import { Sequelize, Op } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import ICuentaCorrienteItemRepository from '../../../domain/repositories/cuenta-corriente-item-repository';
import CuentaCorrienteItemModel from './models/cuenta-corriente-item-model';
import CuentaCorrienteItem from '../../../domain/entities/cuenta-corriente-item';
import CuentaCorrienteItemFilter from '../../../domain/dto/cuenta-corriente-item-filter';
import CuentaCorrienteItemRecibo from '../../../domain/dto/cuenta-corriente-item-recibo';

export default class CuentaCorrienteItemRepositorySequelize implements ICuentaCorrienteItemRepository {

	constructor() {

	}

	async list() {
		const data = await CuentaCorrienteItemModel.findAll();
		const result = data.map((row) => new CuentaCorrienteItem(...row.getDataValues()));

		return result;
	}

	async listByFilter(cuentaCorrienteItemFilter: CuentaCorrienteItemFilter) {

		let filters = {};
		if (cuentaCorrienteItemFilter.numeroPartida > 0) filters["numeroPartida"] = cuentaCorrienteItemFilter.numeroPartida;
		if (cuentaCorrienteItemFilter.idCuenta > 0) filters["idCuenta"] = cuentaCorrienteItemFilter.idCuenta;
		if (cuentaCorrienteItemFilter.codigoDelegacion.length > 0) filters["codigoDelegacion"] = cuentaCorrienteItemFilter.codigoDelegacion;
		if (cuentaCorrienteItemFilter.idTipoMovimiento > 0) filters["idTipoMovimiento"] = cuentaCorrienteItemFilter.idTipoMovimiento;
		if (cuentaCorrienteItemFilter.numeroMovimiento > 0) filters["numeroMovimiento"] = cuentaCorrienteItemFilter.numeroMovimiento;
		if (cuentaCorrienteItemFilter.periodo.length > 0) filters["periodo"] = cuentaCorrienteItemFilter.periodo;
		if (cuentaCorrienteItemFilter.cuota > 0) filters["cuota"] = cuentaCorrienteItemFilter.cuota;
		if (cuentaCorrienteItemFilter.fechaDesde !== null && cuentaCorrienteItemFilter.fechaHasta !== null) {
			filters["fechaMovimiento"] = {
				[Op.gte]: cuentaCorrienteItemFilter.fechaDesde,
				[Op.lte]: cuentaCorrienteItemFilter.fechaHasta
			};
		}
		else {
			if (cuentaCorrienteItemFilter.fechaDesde !== null) filters["fechaMovimiento"] = {[Op.gte]: cuentaCorrienteItemFilter.fechaDesde};
			if (cuentaCorrienteItemFilter.fechaHasta !== null) filters["fechaMovimiento"] = {[Op.lte]: cuentaCorrienteItemFilter.fechaHasta};
		}
		if (cuentaCorrienteItemFilter.fechaDeuda !== null) filters["fechaVencimiento2"] = {[Op.lt]: cuentaCorrienteItemFilter.fechaDeuda};

		let data = null;
		if (cuentaCorrienteItemFilter.numeroPartida === 0 &&
			cuentaCorrienteItemFilter.idCuenta === 0 &&
			cuentaCorrienteItemFilter.codigoDelegacion.length === 0 &&
			cuentaCorrienteItemFilter.idTipoMovimiento === 0 &&
			cuentaCorrienteItemFilter.numeroMovimiento === 0 &&
			cuentaCorrienteItemFilter.periodo.length === 0 &&
			cuentaCorrienteItemFilter.cuota === 0 &&
			cuentaCorrienteItemFilter.fechaDesde === null &&
			cuentaCorrienteItemFilter.fechaHasta === null &&
			cuentaCorrienteItemFilter.fechaDeuda === null) {
			data = await CuentaCorrienteItemModel.findAll();
		}
		else {
			data = await CuentaCorrienteItemModel.findAll({ where: filters });
		}
		const result = data.map((row) => new CuentaCorrienteItem(...row.getDataValues()));

        return result;
    }

	async listByCuenta(idCuenta:number) {
		const data = await CuentaCorrienteItemModel.findAll({ where: { idCuenta: idCuenta } });
		const result = data.map((row) => new CuentaCorrienteItem(...row.getDataValues()));

		return result;
	}

	async listByTasa(idTasa:number, idSubTasa:number, periodo:string, cuota:number, idCuenta:number = null) {
		const where = {
			idTasa: idTasa,
			idSubTasa: idSubTasa,
			periodo: periodo,
			cuota: cuota
		}
		if (idCuenta) where["idCuenta"] = idCuenta;
		
		const data = await CuentaCorrienteItemModel.findAll({
			where: where
		});
		const result = data.map((row) => new CuentaCorrienteItem(...row.getDataValues()));

		return result;
	}

	async listByPartida(numeroPartida:number) {
		const data = await CuentaCorrienteItemModel.findAll({ where: { numeroPartida: numeroPartida } });
		const result = data.map((row) => new CuentaCorrienteItem(...row.getDataValues()));

		return result;
	}

	async listByPlanPago(idPlanPago:number) {
		const data = await CuentaCorrienteItemModel.findAll({ where: { idPlanPago: idPlanPago } });
		const result = data.map((row) => new CuentaCorrienteItem(...row.getDataValues()));

		return result;
	}

	async listByRecibo(cuentaCorrienteRecibo: CuentaCorrienteItemRecibo) {
		let filters = {};
		if (cuentaCorrienteRecibo.numeroPartida > 0) filters["numeroPartida"] = cuentaCorrienteRecibo.numeroPartida;
		if (cuentaCorrienteRecibo.idCuenta > 0) filters["idCuenta"] = cuentaCorrienteRecibo.idCuenta;
		if (cuentaCorrienteRecibo.idTasa > 0) filters["idTasa"] = cuentaCorrienteRecibo.idTasa;
		if (cuentaCorrienteRecibo.idSubTasa > 0) filters["idSubTasa"] = cuentaCorrienteRecibo.idSubTasa;
		if (cuentaCorrienteRecibo.codigoDelegacion.length > 0) filters["codigoDelegacion"] = cuentaCorrienteRecibo.codigoDelegacion;
		if (cuentaCorrienteRecibo.numeroMovimiento > 0) filters["numeroMovimiento"] = cuentaCorrienteRecibo.numeroMovimiento;
		if (cuentaCorrienteRecibo.periodo.length > 0) filters["periodo"] = cuentaCorrienteRecibo.periodo;
		if (cuentaCorrienteRecibo.cuota > 0) filters["cuota"] = cuentaCorrienteRecibo.cuota;

		let data = null;
		if (cuentaCorrienteRecibo.numeroPartida === 0 &&
			cuentaCorrienteRecibo.idCuenta === 0 &&
			cuentaCorrienteRecibo.idTasa === 0 &&
			cuentaCorrienteRecibo.idSubTasa === 0 &&
			cuentaCorrienteRecibo.codigoDelegacion.length === 0 &&
			cuentaCorrienteRecibo.numeroMovimiento === 0 &&
			cuentaCorrienteRecibo.periodo.length === 0 &&
			cuentaCorrienteRecibo.cuota === 0) {
			data = await CuentaCorrienteItemModel.findAll();
		}
		else {
			data = await CuentaCorrienteItemModel.findAll({ where: filters });
		}
		const result = data.map((row) => new CuentaCorrienteItem(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CuentaCorrienteItemModel.findOne({ where: { id: id } });
		const result = (data) ? new CuentaCorrienteItem(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CuentaCorrienteItem) {
		const data = await CuentaCorrienteItemModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionCuentaCorrienteResultado: row.idEmisionCuentaCorrienteResultado,
			idPlanPago: row.idPlanPago,
			idPlanPagoCuota: row.idPlanPagoCuota,
			idCertificadoApremio: row.idCertificadoApremio,
			idCuenta: row.idCuenta,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			periodo: row.periodo,
			cuota: row.cuota,
			codigoDelegacion: row.codigoDelegacion,
			idTipoMovimiento: row.idTipoMovimiento,
			numeroMovimiento: row.numeroMovimiento,
			numeroPartida: row.numeroPartida,
			tasaCabecera: row.tasaCabecera,
			idTipoValor: row.idTipoValor,
			importeDebe: row.importeDebe,
			importeHaber: row.importeHaber,
			idLugarPago: row.idLugarPago,
			fechaOrigen: row.fechaOrigen,
			fechaMovimiento: row.fechaMovimiento,
			fechaVencimiento1: row.fechaVencimiento1,
			fechaVencimiento2: row.fechaVencimiento2,
			cantidad: row.cantidad,
			idEdesurCliente: row.idEdesurCliente,
			detalle: row.detalle,
			item: row.item,
			idUsuarioRegistro: row.idUsuarioRegistro,
			fechaRegistro: row.fechaRegistro
		});
		const result = new CuentaCorrienteItem(...data.getDataValues());

		return result;
	}

	async addByBloque(rows:Array<CuentaCorrienteItem>) {

		const bulkRows = rows.map((row: CuentaCorrienteItem) => {
            return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idEmisionCuentaCorrienteResultado: row.idEmisionCuentaCorrienteResultado,
				idPlanPago: row.idPlanPago,
				idPlanPagoCuota: row.idPlanPagoCuota,
				idCertificadoApremio: row.idCertificadoApremio,
				idCuenta: row.idCuenta,
				idTasa: row.idTasa,
				idSubTasa: row.idSubTasa,
				periodo: row.periodo,
				cuota: row.cuota,
				codigoDelegacion: row.codigoDelegacion,
				idTipoMovimiento: row.idTipoMovimiento,
				numeroMovimiento: row.numeroMovimiento,
				numeroPartida: row.numeroPartida,
				tasaCabecera: row.tasaCabecera,
				idTipoValor: row.idTipoValor,
				importeDebe: row.importeDebe,
				importeHaber: row.importeHaber,
				idLugarPago: row.idLugarPago,
				fechaOrigen: row.fechaOrigen,
				fechaMovimiento: row.fechaMovimiento,
				fechaVencimiento1: row.fechaVencimiento1,
				fechaVencimiento2: row.fechaVencimiento2,
				cantidad: row.cantidad,
				idEdesurCliente: row.idEdesurCliente,
				detalle: row.detalle,
				item: row.item,
				idUsuarioRegistro: row.idUsuarioRegistro,
				fechaRegistro: row.fechaRegistro
			}
		});

		const affectedCount = await CuentaCorrienteItemModel.bulkCreate(bulkRows);
        const result = (affectedCount != null) ? {affectedCount: affectedCount} : null;
        return result;
	}

	async modify(id:number, row:CuentaCorrienteItem) {
		const affectedCount = await CuentaCorrienteItemModel.update({
			idCuenta: row.idCuenta,
			idLugarPago: row.idLugarPago,
			idCertificadoApremio: row.idCertificadoApremio,
			cantidad: row.cantidad,
			idEdesurCliente: row.idEdesurCliente,
			idUsuarioRegistro: row.idUsuarioRegistro,
			fechaRegistro: row.fechaRegistro
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CuentaCorrienteItemModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CuentaCorrienteItem(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CuentaCorrienteItemModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await CuentaCorrienteItemModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
