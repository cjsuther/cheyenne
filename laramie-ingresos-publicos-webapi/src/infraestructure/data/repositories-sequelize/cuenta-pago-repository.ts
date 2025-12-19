import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import ICuentaPagoRepository from '../../../domain/repositories/cuenta-pago-repository';
import CuentaPagoModel from './models/cuenta-pago-model';
import CuentaPago from '../../../domain/entities/cuenta-pago';

export default class CuentaPagoRepositorySequelize implements ICuentaPagoRepository {

	constructor() {

	}

	async list() {
		const data = await CuentaPagoModel.findAll();
		const result = data.map((row) => new CuentaPago(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucion(idEmisionEjecucion:number) {
		const data = await CuentaPagoModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion }});
		const result = data.map((row) => new CuentaPago(...row.getDataValues()));

		return result;
	}

	async listByPlanPago(idPlanPago:number) {
		const data = await CuentaPagoModel.findAll({ where: { idPlanPago: idPlanPago } });
		const result = data.map((row) => new CuentaPago(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CuentaPagoModel.findOne({ where: { id: id } });
		const result = (data) ? new CuentaPago(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CuentaPago) {
		const data = await CuentaPagoModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idPlanPago: row.idPlanPago,
			idCuenta: row.idCuenta,
			codigoDelegacion: row.codigoDelegacion,
			numeroRecibo: row.numeroRecibo,
			periodo: row.periodo,
			cuota: row.cuota,
			importeVencimiento1: row.importeVencimiento1,
			importeVencimiento2: row.importeVencimiento2,
			fechaVencimiento1: row.fechaVencimiento1,
			fechaVencimiento2: row.fechaVencimiento2,
			codigoBarras: row.codigoBarras,
			pagoAnticipado: row.pagoAnticipado,
			reciboEspecial: row.reciboEspecial
		});
		const result = new CuentaPago(...data.getDataValues());

		return result;
	}

	async addByBloque(rows:Array<CuentaPago>) {

		const bulkRows = rows.map((row: CuentaPago) => {
            return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idPlanPago: row.idPlanPago,
				idCuenta: row.idCuenta,
				codigoDelegacion: row.codigoDelegacion,
				numeroRecibo: row.numeroRecibo,
				periodo: row.periodo,
				cuota: row.cuota,
				importeVencimiento1: row.importeVencimiento1,
				importeVencimiento2: row.importeVencimiento2,
				fechaVencimiento1: row.fechaVencimiento1,
				fechaVencimiento2: row.fechaVencimiento2,
				codigoBarras: row.codigoBarras,
				pagoAnticipado: row.pagoAnticipado,
				reciboEspecial: row.reciboEspecial
			}
		});

		const affectedCount = await CuentaPagoModel.bulkCreate(bulkRows);
        const result = (affectedCount != null) ? {affectedCount: affectedCount} : null;
        return result;
	}

	async modify(id:number, row:CuentaPago) {
		const affectedCount = await CuentaPagoModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idPlanPago: row.idPlanPago,
			idCuenta: row.idCuenta,
			codigoDelegacion: row.codigoDelegacion,
			numeroRecibo: row.numeroRecibo,
			periodo: row.periodo,
			cuota: row.cuota,
			importeVencimiento1: row.importeVencimiento1,
			importeVencimiento2: row.importeVencimiento2,
			fechaVencimiento1: row.fechaVencimiento1,
			fechaVencimiento2: row.fechaVencimiento2,
			codigoBarras: row.codigoBarras,
			pagoAnticipado: row.pagoAnticipado,
			reciboEspecial: row.reciboEspecial
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CuentaPagoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CuentaPago(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CuentaPagoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await CuentaPagoModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
