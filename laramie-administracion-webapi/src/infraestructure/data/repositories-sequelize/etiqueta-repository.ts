import IEtiquetaRepository from '../../../domain/repositories/etiqueta-repository';
import EtiquetaModel from './models/etiqueta-model';
import Etiqueta from '../../../domain/entities/etiqueta';
import EtiquetaState from '../../../domain/dto/etiqueta-state';

export default class EtiquetaRepositorySequelize implements IEtiquetaRepository {

	constructor() {

	}

	async list() {
		const data = await EtiquetaModel.findAll();
		const result = data.map((row) => new Etiqueta(...row.getDataValues()));

		return result;
	}

    async listByEntidad(entidad:string, idEntidad:number) {
        const data = await EtiquetaModel.findAll({ where: { entidad: entidad, idEntidad: idEntidad } });
        const result = data.map((row) => new EtiquetaState(...row.getDataValues()));

        return result;
    }

	async listByPersonaFisica(idPersonaFisica:number) {
        const cursor = await EtiquetaModel.sequelize.query(
            `SELECT etiqueta_persona_fisica_lista(:p_id_persona_fisica,'cursor_etiqueta_persona_fisica'); FETCH ALL IN "cursor_etiqueta_persona_fisica";`,
            {
                replacements: {
                    p_id_persona_fisica: idPersonaFisica
                }
            }
        );
        const data = cursor[1][1].rows;
		const result = data.map((row) => {
            let item = new EtiquetaState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.codigo = row.codigo;
            
            return item;
        });

        return result;
    }

	async listByPersonaJuridica(idPersonaJuridica:number) {
        const cursor = await EtiquetaModel.sequelize.query(
            `SELECT etiqueta_persona_juridica_lista(:p_id_persona_juridica,'cursor_etiqueta_persona_juridica'); FETCH ALL IN "cursor_etiqueta_persona_juridica";`,
            {
                replacements: {
                    p_id_persona_juridica: idPersonaJuridica
                }
            }
        );
        const data = cursor[1][1].rows;
		const result = data.map((row) => {
            let item = new EtiquetaState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.codigo = row.codigo;
            
            return item;
        });

        return result;
    }

	async findById(id:number) {
		const data = await EtiquetaModel.findOne({ where: { id: id } });
		const result = (data) ? new Etiqueta(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Etiqueta) {
		const data = await EtiquetaModel.create({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			codigo: row.codigo
		});
		const result = new Etiqueta(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Etiqueta) {
		const affectedCount = await EtiquetaModel.update({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			codigo: row.codigo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EtiquetaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Etiqueta(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EtiquetaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
