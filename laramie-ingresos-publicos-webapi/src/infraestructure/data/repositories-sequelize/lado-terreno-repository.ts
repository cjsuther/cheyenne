import ILadoTerrenoRepository from '../../../domain/repositories/lado-terreno-repository';
import LadoTerrenoModel from './models/lado-terreno-model';
import LadoTerreno from '../../../domain/entities/lado-terreno';
import LadoTerrenoState from '../../../domain/dto/lado-terreno-state';
import DireccionModel from './models/direccion-model';
import Direccion from '../../../domain/entities/direccion';
import LadoTerrenoServicioModel from './models/lado-terreno-servicio-model';
import LadoTerrenoServicioState from '../../../domain/dto/lado-terreno-servicio-state';
import LadoTerrenoObraModel from './models/lado-terreno-obra-model';
import LadoTerrenoObraState from '../../../domain/dto/lado-terreno-obra-state';


export default class LadoTerrenoRepositorySequelize implements ILadoTerrenoRepository {

	constructor() {

	}

	async listByInmueble(idInmueble: number) {
		const data = await LadoTerrenoModel.findAll({
            include: [
				{ model: DireccionModel, as: 'direccion' },
                { model: LadoTerrenoServicioModel, as: 'ladoTerrenoServicio' },
				{ model: LadoTerrenoObraModel, as: 'ladoTerrenoObra' }
            ],
			where: { idInmueble: idInmueble }
		});
		const result = data.map((row) => {
			const direccion = row["direccion"];
			const ladoTerrenoServicio = row["ladoTerrenoServicio"];
			const ladoTerrenoObra = row["ladoTerrenoObra"];

			let ladoTerreno = new LadoTerrenoState(...row.getDataValues());
			ladoTerreno.direccion = new Direccion(...direccion[0].getDataValues());
			ladoTerreno.ladosTerrenoServicio = (ladoTerrenoServicio.map((servicio) => new LadoTerrenoServicioState(...servicio.getDataValues())) as Array<LadoTerrenoServicioState>).sort((a, b) => a.id - b.id);
			ladoTerreno.ladosTerrenoObra = (ladoTerrenoObra.map((obra) => new LadoTerrenoObraState(...obra.getDataValues())) as Array<LadoTerrenoObraState>).sort((a, b) => a.id - b.id);

			return ladoTerreno;
		});

		return result;
	}

	async findById(id:number) {
		const data = await LadoTerrenoModel.findOne({ where: { id: id } });
		const result = (data) ? new LadoTerreno(...data.getDataValues()) : null;

		return result;
	}

	async add(row:LadoTerreno) {
		const data = await LadoTerrenoModel.create({
			idInmueble: row.idInmueble,
			idTipoLado: row.idTipoLado,
			numero: row.numero,
			metros: row.metros,
			reduccion: row.reduccion
		});
		const result = new LadoTerreno(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:LadoTerreno) {
		const affectedCount = await LadoTerrenoModel.update({
			idInmueble: row.idInmueble,
			idTipoLado: row.idTipoLado,
			numero: row.numero,
			metros: row.metros,
			reduccion: row.reduccion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await LadoTerrenoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new LadoTerreno(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await LadoTerrenoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
