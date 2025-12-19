import IPlantillaDocumentoRepository from '../../../domain/repositories/plantilla-documento-repository';
import PlantillaDocumentoModel from './models/plantilla-documento-model';
import TipoActoProcesalPlantillaDocumentoModel from './models/tipo-acto-procesal-plantilla-documento-model';
import PlantillaDocumento from '../../../domain/entities/plantilla-documento';

export default class PlantillaDocumentoRepositorySequelize implements IPlantillaDocumentoRepository {

	constructor() {

	}

	async list() {
		const data = await PlantillaDocumentoModel.findAll();
		const result = data.map((row) => new PlantillaDocumento(...row.getDataValues()));

		return result;
	}

	async listByTipoPlantillaDocumento(idTipoPlantillaDocumento: number) {
        const data = await PlantillaDocumentoModel.findAll({ where: { idTipoPlantillaDocumento: idTipoPlantillaDocumento } });
        const result = data.map((row) => new PlantillaDocumento(...row.getDataValues()));

        return result;
    }

	async listByTipoActoProcesal(idTipoActoProcesal:number) {
        const data = await PlantillaDocumentoModel.findAll(
            {
                include: 
                [{
                    model: TipoActoProcesalPlantillaDocumentoModel,
                    required: true,
                    as: 'tipoActoProcesalPlantillaDocumento',
                    where: { idTipoActoProcesal: idTipoActoProcesal }
                }]
            }
        );
        const result = data.map((row) => new PlantillaDocumento(...row.getDataValues()));

        return result;
    }

	async findById(id:number) {
		const data = await PlantillaDocumentoModel.findOne({ where: { id: id } });
		const result = (data) ? new PlantillaDocumento(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlantillaDocumento) {
		const data = await PlantillaDocumentoModel.create({
			idTipoPlantillaDocumento: row.idTipoPlantillaDocumento,
			descripcion: row.descripcion,
			nombre: row.nombre,
			path: row.path,
			idUsuario: row.idUsuario,
			fecha: row.fecha
		});
		const result = new PlantillaDocumento(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlantillaDocumento) {
		const affectedCount = await PlantillaDocumentoModel.update({
			idTipoPlantillaDocumento: row.idTipoPlantillaDocumento,
			descripcion: row.descripcion,
			nombre: row.nombre,
			path: row.path,
			idUsuario: row.idUsuario,
			fecha: row.fecha
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlantillaDocumentoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlantillaDocumento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlantillaDocumentoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
