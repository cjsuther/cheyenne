import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IExpedienteRepository from '../../../domain/repositories/expediente-repository';
import ExpedienteModel from './models/expediente-model';
import Expediente from '../../../domain/entities/expediente';
import ExpedienteFilter from '../../../domain/dto/expediente-filter';

export default class ExpedienteRepositorySequelize implements IExpedienteRepository {

	constructor() {

	}

	async list() {
		const data = await ExpedienteModel.findAll();
		const result = data.map((row) => new Expediente(...row.getDataValues()));

		return result;
	}

	async listByFilter(expedienteFilter: ExpedienteFilter) {
        const cursor = await ExpedienteModel.sequelize.query(
            `SELECT expediente_lista(:p_id_tipo_expediente,:p_expediente,:p_etiqueta,'cursor_expediente'); FETCH ALL IN "cursor_expediente";`,
            {
                replacements: {
                    p_id_tipo_expediente: expedienteFilter.idTipoExpediente,
                    p_expediente: expedienteFilter.expediente,
					p_etiqueta: expedienteFilter.etiqueta
                }
            }
        );
        const data = cursor[1][1].rows;
        
        const result = data.map((row) => {
            let item = new Expediente();
            item.id = row.id;
			item.matricula = row.matricula;
			item.ejercicio = row.ejercicio;
			item.numero = row.numero;
			item.letra = row.letra;
			item.idProvincia = row.id_provincia;
			item.idTipoExpediente = row.id_tipo_expediente;
			item.subnumero = row.subnumero;
			item.idTemaExpediente = row.id_tema_expediente;
			item.referenciaExpediente = row.referencia_expediente;
			item.fechaCreacion = row.fecha_creacion;
            
            return item;
        });

        return result;
    }

	async findById(id:number) {
		const data = await ExpedienteModel.findOne({ where: { id: id } });
		const result = (data) ? new Expediente(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Expediente) {
		const data = await ExpedienteModel.create({
			matricula: row.matricula,
			ejercicio: row.ejercicio,
			numero: row.numero,
			letra: row.letra,
			idProvincia: row.idProvincia,
			idTipoExpediente: row.idTipoExpediente,
			subnumero: row.subnumero,
			idTemaExpediente: row.idTemaExpediente,
			referenciaExpediente: row.referenciaExpediente,
			fechaCreacion: row.fechaCreacion
		});
		const result = new Expediente(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Expediente) {
		const affectedCount = await ExpedienteModel.update({
			matricula: row.matricula,
			ejercicio: row.ejercicio,
			numero: row.numero,
			letra: row.letra,
			idProvincia: row.idProvincia,
			idTipoExpediente: row.idTipoExpediente,
			subnumero: row.subnumero,
			idTemaExpediente: row.idTemaExpediente,
			referenciaExpediente: row.referenciaExpediente,
			fechaCreacion: row.fechaCreacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ExpedienteModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Expediente(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ExpedienteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await ExpedienteModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
