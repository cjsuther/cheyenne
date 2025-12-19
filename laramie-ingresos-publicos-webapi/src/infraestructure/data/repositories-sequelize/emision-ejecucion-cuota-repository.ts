import IEmisionEjecucionCuotaRepository from '../../../domain/repositories/emision-ejecucion-cuota-repository';
import EmisionEjecucionCuotaModel from './models/emision-ejecucion-cuota-model';
import EmisionEjecucionCuota from '../../../domain/entities/emision-ejecucion-cuota';
import EmisionEjecucionCuentaModel from './models/emision-ejecucion-cuenta-model';
import EmisionCuotaModel from './models/emision-cuota-model';
import EmisionEjecucionCuenta from '../../../domain/entities/emision-ejecucion-cuenta';
import EmisionCuota from '../../../domain/entities/emision-cuota';

export default class EmisionEjecucionCuotaRepositorySequelize implements IEmisionEjecucionCuotaRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionEjecucionCuotaModel.findAll();
		const result = data.map((row) => new EmisionEjecucionCuota(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucion(idEmisionEjecucion:number, includeData: boolean) {
		let result = null;
		if (includeData) {
			const data = await EmisionEjecucionCuotaModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion },
				order: [[ 'numeroRecibo', 'ASC' ], [ 'orden', 'ASC' ]],
				include: [
					{ model: EmisionEjecucionCuentaModel, as: 'emisionEjecucionCuenta' },
					{ model: EmisionCuotaModel, as: 'emisionCuota' }
				]
			});
			result = data.map((row) => {
				const emisionEjecucionCuenta = row["emisionEjecucionCuenta"];
				const emisionCuota = row["emisionCuota"];
				let emisionEjecucionCuota = new EmisionEjecucionCuota(...row.getDataValues());
				emisionEjecucionCuota.emisionEjecucionCuenta = new EmisionEjecucionCuenta(...emisionEjecucionCuenta.getDataValues());
				emisionEjecucionCuota.emisionCuota = new EmisionCuota(...emisionCuota.getDataValues());
				return emisionEjecucionCuota;
			});
		}
		else {
			const data = await EmisionEjecucionCuotaModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion } });
			result = data.map((row) => new EmisionEjecucionCuota(...row.getDataValues()));
		}

		return result;
	}

	async listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const data = await EmisionEjecucionCuotaModel.findAll({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = data.map((row) => new EmisionEjecucionCuota(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionEjecucionCuotaModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionEjecucionCuota(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionEjecucionCuota) {
		const data = await EmisionEjecucionCuotaModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionCuota: row.idEmisionCuota,
			idPlanPagoCuota: row.idPlanPagoCuota,
			numeroRecibo: row.numeroRecibo,
			codigoBarras: row.codigoBarras,
			orden: row.orden
		});
		const result = new EmisionEjecucionCuota(...data.getDataValues());

		return result;
	}

	async addByBloque(rows:Array<EmisionEjecucionCuota>) {

		const bulkRows = rows.map((row: EmisionEjecucionCuota) => {
            return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
				idEmisionCuota: row.idEmisionCuota,
				idPlanPagoCuota: row.idPlanPagoCuota,
				numeroRecibo: row.numeroRecibo,
				codigoBarras: row.codigoBarras,
				orden: row.orden
			}
		});

		const affectedCount = await EmisionEjecucionCuotaModel.bulkCreate(bulkRows);
        const result = (affectedCount != null) ? {affectedCount: affectedCount} : null;
        return result;
	}


	async modify(id:number, row:EmisionEjecucionCuota) {
		const affectedCount = await EmisionEjecucionCuotaModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionCuota: row.idEmisionCuota,
			idPlanPagoCuota: row.idPlanPagoCuota,
			numeroRecibo: row.numeroRecibo,
			codigoBarras: row.codigoBarras,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionEjecucionCuotaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionEjecucionCuota(...data.getDataValues()) : null;

		return result;
	}

	async modifyByEmisionEjecucion(updates:Array<any>) {
		let requests = [];
		for(let i=0; i < updates.length; i++) {
			const update = updates[i];
			requests.push(EmisionEjecucionCuotaModel.update(
				{ codigoBarras: update.codigoBarras },
				{ where: { id: update.idEmisionEjecucionCuota } })
			);
		}

		const result = await Promise.all(requests);
		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionEjecucionCuotaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionEjecucion(idEmisionEjecucion:number) {
		const affectedCount = await EmisionEjecucionCuotaModel.destroy({ where: { idEmisionEjecucion: idEmisionEjecucion }});
		const result = (affectedCount > 0) ? {idEmisionEjecucion} : null;
		
		return result;
	}

	async removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const affectedCount = await EmisionEjecucionCuotaModel.destroy({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = (affectedCount > 0) ? {idEmisionEjecucionCuenta} : null;
		
		return result;
	}

}
