import ITipoRubroComercioRepository from '../../../domain/repositories/tipo-rubro-comercio-repository';
import TipoRubroComercioModel from './models/tipo-rubro-comercio-model';
import TipoRubroComercio from '../../../domain/entities/tipo-rubro-comercio';

export default class TipoRubroComercioRepositorySequelize implements ITipoRubroComercioRepository {

	constructor() {

	}

	async list() {
		const data = await TipoRubroComercioModel.findAll();
		const result = data.map((row) => new TipoRubroComercio(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoRubroComercioModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoRubroComercio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoRubroComercio) {
		const data = await TipoRubroComercioModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			agrupamiento: row.agrupamiento,
			fechaBaja: row.fechaBaja,
			facturable: row.facturable,
			generico: row.generico,
			categoria: row.categoria,
			importeMinimo: row.importeMinimo,
			alicuota: row.alicuota,
			regimenGeneral: row.regimenGeneral
		});
		const result = new TipoRubroComercio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoRubroComercio) {
		const affectedCount = await TipoRubroComercioModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			agrupamiento: row.agrupamiento,
			fechaBaja: row.fechaBaja,
			facturable: row.facturable,
			generico: row.generico,
			categoria: row.categoria,
			importeMinimo: row.importeMinimo,
			alicuota: row.alicuota,
			regimenGeneral: row.regimenGeneral
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoRubroComercioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoRubroComercio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoRubroComercioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
