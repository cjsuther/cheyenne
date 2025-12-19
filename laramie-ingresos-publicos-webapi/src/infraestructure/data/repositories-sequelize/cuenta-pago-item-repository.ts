import ICuentaPagoItemRepository from '../../../domain/repositories/cuenta-pago-item-repository';
import CuentaPagoItemModel from './models/cuenta-pago-item-model';
import CuentaPagoItem from '../../../domain/entities/cuenta-pago-item';

export default class CuentaPagoItemRepositorySequelize implements ICuentaPagoItemRepository {

	constructor() {

	}

	async list() {
		const data = await CuentaPagoItemModel.findAll();
		const result = data.map((row) => new CuentaPagoItem(...row.getDataValues()));

		return result;
	}

	async listByCuentaPago(idCuentaPago:number) {
		const data = await CuentaPagoItemModel.findAll({ where: { idCuentaPago: idCuentaPago } });
		const result = data.map((row) => new CuentaPagoItem(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CuentaPagoItemModel.findOne({ where: { id: id } });
		const result = (data) ? new CuentaPagoItem(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CuentaPagoItem) {
		const data = await CuentaPagoItemModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionConceptoResultado: row.idEmisionConceptoResultado,
			idPlanPagoCuota: row.idPlanPagoCuota,
			idCuentaPago: row.idCuentaPago,
			idCuenta: row.idCuenta,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			periodo: row.periodo,
			cuota: row.cuota,
			importeNominal: row.importeNominal,
			importeAccesorios: row.importeAccesorios,
			importeRecargos: row.importeRecargos,
			importeMultas: row.importeMultas,
			importeHonorarios: row.importeHonorarios,
			importeAportes: row.importeAportes,
			importeTotal: row.importeTotal,
			importeNeto: row.importeNeto,
			importeDescuento: row.importeDescuento,
			fechaVencimientoTermino: row.fechaVencimientoTermino,
			fechaCobro: row.fechaCobro,
			idEdesurCliente: row.idEdesurCliente,
			item: row.item,
			numeroPartida: row.numeroPartida
		});
		const result = new CuentaPagoItem(...data.getDataValues());

		return result;
	}

	async addByBloque(rows:Array<CuentaPagoItem>) {

		const bulkRows = rows.map((row: CuentaPagoItem) => {
            return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idEmisionConceptoResultado: row.idEmisionConceptoResultado,
				idPlanPagoCuota: row.idPlanPagoCuota,
				idCuentaPago: row.idCuentaPago,
				idCuenta: row.idCuenta,
				idTasa: row.idTasa,
				idSubTasa: row.idSubTasa,
				periodo: row.periodo,
				cuota: row.cuota,
				importeNominal: row.importeNominal,
				importeAccesorios: row.importeAccesorios,
				importeRecargos: row.importeRecargos,
				importeMultas: row.importeMultas,
				importeHonorarios: row.importeHonorarios,
				importeAportes: row.importeAportes,
				importeTotal: row.importeTotal,
				importeNeto: row.importeNeto,
				importeDescuento: row.importeDescuento,
				fechaVencimientoTermino: row.fechaVencimientoTermino,
				fechaCobro: row.fechaCobro,
				idEdesurCliente: row.idEdesurCliente,
				item: row.item,
				numeroPartida: row.numeroPartida
			}
		});

		const affectedCount = await CuentaPagoItemModel.bulkCreate(bulkRows);
        const result = (affectedCount != null) ? {affectedCount: affectedCount} : null;
        return result;
	}

	async modify(id:number, row:CuentaPagoItem) {
		const affectedCount = await CuentaPagoItemModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionConceptoResultado: row.idEmisionConceptoResultado,
			idPlanPagoCuota: row.idPlanPagoCuota,
			idCuentaPago: row.idCuentaPago,
			idCuenta: row.idCuenta,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			periodo: row.periodo,
			cuota: row.cuota,
			importeNominal: row.importeNominal,
			importeAccesorios: row.importeAccesorios,
			importeRecargos: row.importeRecargos,
			importeMultas: row.importeMultas,
			importeHonorarios: row.importeHonorarios,
			importeAportes: row.importeAportes,
			importeTotal: row.importeTotal,
			importeNeto: row.importeNeto,
			importeDescuento: row.importeDescuento,
			fechaVencimientoTermino: row.fechaVencimientoTermino,
			fechaCobro: row.fechaCobro,
			idEdesurCliente: row.idEdesurCliente,
			item: row.item,
			numeroPartida: row.numeroPartida
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CuentaPagoItemModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CuentaPagoItem(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CuentaPagoItemModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
