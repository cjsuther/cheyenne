import ITasaVencimientoRepository from '../../../domain/repositories/tasa-vencimiento-repository';
import TasaVencimientoModel from './models/tasa-vencimiento-model';
import TasaVencimiento from '../../../domain/entities/tasa-vencimiento';

export default class TasaVencimientoRepositorySequelize implements ITasaVencimientoRepository {

	constructor() {

	}

	async list() {
		const data = await TasaVencimientoModel.findAll();
		const result = data.map((row) => new TasaVencimiento(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TasaVencimientoModel.findOne({ where: { id: id } });
		const result = (data) ? new TasaVencimiento(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TasaVencimiento) {
		const data = await TasaVencimientoModel.create({
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			periodo: row.periodo,
			cuota: row.cuota,
			fechaVencimiento1: row.fechaVencimiento1,
			fechaVencimiento2: row.fechaVencimiento2,
			idEmisionEjecucion: row.idEmisionEjecucion
		});
		const result = new TasaVencimiento(...data.getDataValues());

		return result;
	}

	async addByBloque(rows:Array<TasaVencimiento>) {

		const bulkRows = rows.map((row: TasaVencimiento) => {
            return {
				idTasa: row.idTasa,
				idSubTasa: row.idSubTasa,
				periodo: row.periodo,
				cuota: row.cuota,
				fechaVencimiento1: row.fechaVencimiento1,
				fechaVencimiento2: row.fechaVencimiento2,
				idEmisionEjecucion: row.idEmisionEjecucion
			}
		});

		const affectedCount = await TasaVencimientoModel.bulkCreate(bulkRows);
        const result = (affectedCount != null) ? {affectedCount: affectedCount} : null;
        return result;
	}

	async modify(id:number, row:TasaVencimiento) {
		const affectedCount = await TasaVencimientoModel.update({
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			periodo: row.periodo,
			cuota: row.cuota,
			fechaVencimiento1: row.fechaVencimiento1,
			fechaVencimiento2: row.fechaVencimiento2,
			idEmisionEjecucion: row.idEmisionEjecucion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TasaVencimientoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TasaVencimiento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TasaVencimientoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
