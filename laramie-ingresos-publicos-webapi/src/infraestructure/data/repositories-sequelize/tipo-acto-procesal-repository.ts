import { Op } from 'sequelize';
import ITipoActoProcesalRepository from '../../../domain/repositories/tipo-acto-procesal-repository';
import TipoActoProcesalModel from './models/tipo-acto-procesal-model';
import TipoActoProcesalPlantillaDocumentoModel from './models/tipo-acto-procesal-plantilla-documento-model';
import TipoActoProcesal from '../../../domain/entities/tipo-acto-procesal';

export default class TipoActoProcesalRepositorySequelize implements ITipoActoProcesalRepository {

	constructor() {

	}

	async list() {
		const data = await TipoActoProcesalModel.findAll();
		const result = data.map((row) => new TipoActoProcesal(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoActoProcesalModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoActoProcesal(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoActoProcesal) {
		const data = await TipoActoProcesalModel.create({
			idTipoActoProcesal: row.idTipoActoProcesal,
			codigoActoProcesal: row.codigoActoProcesal,
			descripcion: row.descripcion,
			plazoDias: row.plazoDias,
			porcentajeHonorarios: row.porcentajeHonorarios,
			fechaBaja: row.fechaBaja,
			nivel: row.nivel,
			orden: row.orden
		});
		const result = new TipoActoProcesal(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoActoProcesal) {
		const affectedCount = await TipoActoProcesalModel.update({
			idTipoActoProcesal: row.idTipoActoProcesal,
			codigoActoProcesal: row.codigoActoProcesal,
			descripcion: row.descripcion,
			plazoDias: row.plazoDias,
			porcentajeHonorarios: row.porcentajeHonorarios,
			fechaBaja: row.fechaBaja,
			nivel: row.nivel,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoActoProcesalModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoActoProcesal(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoActoProcesalModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}


	async checkPlantillaDocumento(id:number, idPlantillaDocumento:number) {
        const data = await TipoActoProcesalPlantillaDocumentoModel.findAll({ where: { idTipoActoProcesal: id, idPlantillaDocumento: idPlantillaDocumento } });
        const result = (data && data.length);

        return result;
    }

    async bindPlantillasDocumentos(id:number, plantillasDocumentos:number[]) {
        const rows = plantillasDocumentos.map(idPlantillaDocumento => {
            return {
                idTipoActoProcesal: id,
                idPlantillaDocumento: idPlantillaDocumento,
            }
        });

        const affectedCount = await TipoActoProcesalPlantillaDocumentoModel.bulkCreate(rows);

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

    async unbindPlantillasDocumentos(id:number, plantillasDocumentos:number[]) {
        const criteria = plantillasDocumentos.map(idPlantillaDocumento => {
            return {
                [Op.and]: [
                    {idTipoActoProcesal: id}, 
                    {idPlantillaDocumento: idPlantillaDocumento}
                ]
            }
        });

        const affectedCount = await TipoActoProcesalPlantillaDocumentoModel.destroy({
            where: {
                [Op.or]: criteria
            }
        });

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

    async unbindAllPlantillasDocumentos(id:number) {
        const affectedCount = await TipoActoProcesalPlantillaDocumentoModel.destroy({ where: { idTipoActoProcesal: id } });

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

}
