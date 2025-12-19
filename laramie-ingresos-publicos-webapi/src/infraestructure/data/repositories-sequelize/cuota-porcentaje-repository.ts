import ICuotaPorcentajeRepository from '../../../domain/repositories/cuota-porcentaje-repository';
import CuotaPorcentajeModel from './models/cuota-porcentaje-model';
import CuotaPorcentaje from '../../../domain/entities/cuota-porcentaje';

export default class CuotaPorcentajeRepositorySequelize implements ICuotaPorcentajeRepository {

	constructor() {

	}

	async list() {
		const data = await CuotaPorcentajeModel.findAll();
		const result = data.map((row) => new CuotaPorcentaje(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucionCuenta(idEmisionEjecucion:number, idCuenta:number) {
		const data = await CuotaPorcentajeModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion, idCuenta: idCuenta } });
		const result = data.map((row) => new CuotaPorcentaje(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CuotaPorcentajeModel.findOne({ where: { id: id } });
		const result = (data) ? new CuotaPorcentaje(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CuotaPorcentaje) {
		const data = await CuotaPorcentajeModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionImputacionContableResultado: row.idEmisionImputacionContableResultado,
			idCuenta: row.idCuenta,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			periodo: row.periodo,
			cuota: row.cuota,
			idTasaPorcentaje: row.idTasaPorcentaje,
			idSubTasaPorcentaje: row.idSubTasaPorcentaje,
			porcentaje: row.porcentaje,
			importePorcentaje: row.importePorcentaje,
			ejercicio: row.ejercicio
		});
		const result = new CuotaPorcentaje(...data.getDataValues());

		return result;
	}

	async addByBloque(rows:Array<CuotaPorcentaje>) {

		const bulkRows = rows.map((row: CuotaPorcentaje) => {
            return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idEmisionImputacionContableResultado: row.idEmisionImputacionContableResultado,
				idCuenta: row.idCuenta,
				idTasa: row.idTasa,
				idSubTasa: row.idSubTasa,
				periodo: row.periodo,
				cuota: row.cuota,
				idTasaPorcentaje: row.idTasaPorcentaje,
				idSubTasaPorcentaje: row.idSubTasaPorcentaje,
				porcentaje: row.porcentaje,
				importePorcentaje: row.importePorcentaje,
				ejercicio: row.ejercicio
			}
		});

		const affectedCount = await CuotaPorcentajeModel.bulkCreate(bulkRows);
        const result = (affectedCount != null) ? {affectedCount: affectedCount} : null;
        return result;
	}

	async modify(id:number, row:CuotaPorcentaje) {
		const affectedCount = await CuotaPorcentajeModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionImputacionContableResultado: row.idEmisionImputacionContableResultado,
			idCuenta: row.idCuenta,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			periodo: row.periodo,
			cuota: row.cuota,
			idTasaPorcentaje: row.idTasaPorcentaje,
			idSubTasaPorcentaje: row.idSubTasaPorcentaje,
			porcentaje: row.porcentaje,
			importePorcentaje: row.importePorcentaje,
			ejercicio: row.ejercicio
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CuotaPorcentajeModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CuotaPorcentaje(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CuotaPorcentajeModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
