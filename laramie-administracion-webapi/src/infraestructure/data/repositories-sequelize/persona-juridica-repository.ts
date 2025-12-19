import { Sequelize, Op } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IPersonaJuridicaRepository from '../../../domain/repositories/persona-juridica-repository';
import PersonaJuridicaModel from './models/persona-juridica-model';
import PersonaJuridica from '../../../domain/entities/persona-juridica';
import PersonaFilter from '../../../domain/dto/persona-filter';
import PersonaJuridicaRubroAfipModel from './models/persona-juridica-rubro-afip-model';


export default class PersonaJuridicaRepositorySequelize implements IPersonaJuridicaRepository {

	constructor() {

	}

	async list() {
		const data = await PersonaJuridicaModel.findAll();
		const result = data.map((row) => new PersonaJuridica(...row.getDataValues()));

		return result;
	}

	async listByFilter(personaFilter: PersonaFilter) {
        const cursor = await PersonaJuridicaModel.sequelize.query(
            `SELECT persona_juridica_lista(:p_numero_documento,:p_nombre,:p_etiqueta,'cursor_persona_juridica'); FETCH ALL IN "cursor_persona_juridica";`,
            {
                replacements: {
                    p_numero_documento: personaFilter.numeroDocumento,
                    p_nombre: personaFilter.nombre,
					p_etiqueta: personaFilter.etiqueta
                }
            }
        );
        const data = cursor[1][1].rows;
        
        const result = data.map((row) => {
            let item = new PersonaJuridica();
            item.id = row.id;
			item.idTipoDocumento = row.id_tipo_documento;
			item.numeroDocumento = row.numero_documento;
			item.denominacion = row.denominacion;
			item.nombreFantasia = row.nombre_fantasia;
			item.idFormaJuridica = row.id_forma_juridica;
			item.idJurisdiccion = row.id_jurisdiccion;
			item.fechaConstitucion = row.fecha_constitucion;
			item.mesCierre = row.mes_cierre;
			item.logo = row.logo;			
            
            return item;
        });

        return result;
    }

	async findById(id:number) {
		const data = await PersonaJuridicaModel.findOne({ where: { id: id } });
		const result = (data) ? new PersonaJuridica(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PersonaJuridica) {
		const data = await PersonaJuridicaModel.create({
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento,
			denominacion: row.denominacion,
			nombreFantasia: row.nombreFantasia,
			idFormaJuridica: row.idFormaJuridica,
			idJurisdiccion: row.idJurisdiccion,
			fechaConstitucion: row.fechaConstitucion,
			mesCierre: row.mesCierre,
			logo: row.logo
		});
		const result = new PersonaJuridica(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PersonaJuridica) {
		const affectedCount = await PersonaJuridicaModel.update({
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento,
			denominacion: row.denominacion,
			nombreFantasia: row.nombreFantasia,
			idFormaJuridica: row.idFormaJuridica,
			idJurisdiccion: row.idJurisdiccion,
			fechaConstitucion: row.fechaConstitucion,
			mesCierre: row.mesCierre,
			logo: row.logo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PersonaJuridicaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PersonaJuridica(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PersonaJuridicaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async bindRubrosAfip(id:number, rubrosAfip:number[]) {
        const rows = rubrosAfip.map(idRubroAfip => {
            return {
                idPersonaJuridica: id,
                idRubroAfip: idRubroAfip,
            }
        });

        const affectedCount = await PersonaJuridicaRubroAfipModel.bulkCreate(rows);

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

    async unbindRubrosAfip(id:number, rubrosAfip:number[]) {
        const criteria = rubrosAfip.map(idRubroAfip => {
            return {
                [Op.and]: [
                    {idPersonaJuridica: id}, 
                    {idRubroAfip: idRubroAfip}
                ]
            }
        });

        const affectedCount = await PersonaJuridicaRubroAfipModel.destroy({
            where: {
                [Op.or]: criteria
            }
        });

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

    async unbindAllRubrosAfip(id:number) {
        const affectedCount = await PersonaJuridicaRubroAfipModel.destroy({ where: { idPersonaJuridica: id } });

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }	

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await PersonaJuridicaModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
