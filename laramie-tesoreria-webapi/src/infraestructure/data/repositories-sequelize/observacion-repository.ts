import IObservacionRepository from '../../../domain/repositories/observacion-repository';
import ObservacionModel from './models/observacion-model';
import Observacion from '../../../domain/entities/observacion';
import ObservacionState from '../../../domain/dto/observacion-state';

export default class ObservacionRepositorySequelize implements IObservacionRepository {

	constructor() {

	}

	async list() {
		const data = await ObservacionModel.findAll();
		const result = data.map((row) => new Observacion(...row.getDataValues()));

		return result;
	}
	
	async listByEntidad(entidad:string, idEntidad:number) {
        const data = await ObservacionModel.findAll({ where: { entidad: entidad, idEntidad: idEntidad } });
        const result = data.map((row) => new ObservacionState(...row.getDataValues()));

        return result;
    }

	async listByPersonaFisica(idPersonaFisica:number) {
        const cursor = await ObservacionModel.sequelize.query(
            `SELECT * FROM  observacion_persona_fisica_lista(:p_id_persona_fisica);`,
            {
                replacements: {
                    p_id_persona_fisica: idPersonaFisica
                }
            }
        );
		const data = cursor[0] as any;

        const result = data.map((row) => {
            let item = new ObservacionState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.detalle = row.detalle;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async listByPersonaJuridica(idPersonaJuridica:number) {
        const cursor = await ObservacionModel.sequelize.query(
            `SELECT * FROM  observacion_persona_juridica_lista(:p_id_persona_juridica);`,
            {
                replacements: {
                    p_id_persona_juridica: idPersonaJuridica
                }
            }
        );
		const data = cursor[0] as any;

        const result = data.map((row) => {
            let item = new ObservacionState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.detalle = row.detalle;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async findById(id:number) {
		const data = await ObservacionModel.findOne({ where: { id: id } });
		const result = (data) ? new Observacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Observacion) {
		const data = await ObservacionModel.create({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			detalle: row.detalle,
			idUsuario: row.idUsuario,
			fecha: row.fecha
		});
		const result = new Observacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Observacion) {
		const affectedCount = await ObservacionModel.update({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			detalle: row.detalle,
			idUsuario: row.idUsuario,
			fecha: row.fecha
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ObservacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Observacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ObservacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
