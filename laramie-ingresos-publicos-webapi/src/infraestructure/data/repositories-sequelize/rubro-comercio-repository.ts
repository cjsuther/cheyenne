import IRubroComercioRepository from '../../../domain/repositories/rubro-comercio-repository';
import RubroComercioModel from './models/rubro-comercio-model';
import RubroComercio from '../../../domain/entities/rubro-comercio';
import RubroComercioState from '../../../domain/dto/rubro-comercio-state';

export default class RubroComercioRepositorySequelize implements IRubroComercioRepository {

	constructor() {

	}

	async listByComercio(idComercio: number) {
		const data = await RubroComercioModel.findAll({
			where: { idComercio: idComercio }
		});
		
		const result = data.map((row) => {
			let rubroComercio = new RubroComercioState(...row.getDataValues());
			return rubroComercio;
		});

		return result;
	}

	async findById(id:number) {
		const data = await RubroComercioModel.findOne({ where: { id: id } });
		const result = (data) ? new RubroComercio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:RubroComercio) {
		const data = await RubroComercioModel.create({
			idComercio: row. idComercio,
			idTipoRubroComercio: row. idTipoRubroComercio,
			idUbicacionComercio: row. idUbicacionComercio,
			idRubroLiquidacion: row. idRubroLiquidacion,
			idRubroProvincia: row. idRubroProvincia,
			idRubroBCRA: row. idRubroBCRA,
			descripcion: row. descripcion,
			esDeOficio: row. esDeOficio,
			esRubroPrincipal: row. esRubroPrincipal,
			esConDDJJ: row. esConDDJJ,
			fechaInicio: row. fechaInicio,
			fechaCese: row. fechaCese,
			fechaAltaTransitoria: row. fechaAltaTransitoria,
			fechaBajaTransitoria: row. fechaBajaTransitoria,
			fechaBaja: row. fechaBaja,
			idMotivoBajaRubroComercio: row. idMotivoBajaRubroComercio
		});
		const result = new RubroComercio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RubroComercio) {
		const affectedCount = await RubroComercioModel.update({
			idComercio: row. idComercio,
			idTipoRubroComercio: row. idTipoRubroComercio,
			idUbicacionComercio: row. idUbicacionComercio,
			idRubroLiquidacion: row. idRubroLiquidacion,
			idRubroProvincia: row. idRubroProvincia,
			idRubroBCRA: row. idRubroBCRA,
			descripcion: row. descripcion,
			esDeOficio: row. esDeOficio,
			esRubroPrincipal: row. esRubroPrincipal,
			esConDDJJ: row. esConDDJJ,
			fechaInicio: row. fechaInicio,
			fechaCese: row. fechaCese,
			fechaAltaTransitoria: row. fechaAltaTransitoria,
			fechaBajaTransitoria: row. fechaBajaTransitoria,
			fechaBaja: row. fechaBaja,
			idMotivoBajaRubroComercio: row. idMotivoBajaRubroComercio
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RubroComercioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RubroComercio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RubroComercioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByComercio(idComercio: number) {
		const affectedCount = await RubroComercioModel.destroy({ where: { idComercio: idComercio } });
		const result = (affectedCount > 0) ? {idComercio} : null;
		
		return result;
	}
}
