import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IEspecialRepository from '../../../domain/repositories/especial-repository';
import Especial from '../../../domain/entities/especial';
import EspecialRow from '../../../domain/dto/especial-row';
import EspecialModel from './models/especial-model';
import EspecialFilter from '../../../domain/dto/especial-filter';


export default class EspecialRepositorySequelize implements IEspecialRepository {

    constructor() {

    }

    async listByCuenta(especialFilter: EspecialFilter) {
        const cursor = await EspecialModel.sequelize.query(
            `SELECT * FROM especial_lista_cuenta(:p_numero_cuenta,:p_numero_web,:p_numero_documento,:p_id_persona,:p_etiqueta);`,
            {
                replacements: {
                    p_numero_cuenta: especialFilter.numeroCuenta,
                    p_numero_web: especialFilter.numeroWeb,
                    p_numero_documento: especialFilter.numeroDocumento,
                    p_id_persona: especialFilter.idPersona,
                    p_etiqueta: especialFilter.etiqueta
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new EspecialRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
            
            return item;
        });

        return result;
    }

    async findById(id:number) {
        const data = await EspecialModel.findOne({ where: { id: id } });
        const result = (data) ? new Especial(...data.getDataValues()) : null;

        return result;
    }

    async add(row:Especial) {
        const data = await EspecialModel.create({
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaInicio: row.fechaCargaInicio
        });
        const result = new Especial(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Especial) {
        const affectedCount = await EspecialModel.update({
            idCuenta: row.idCuenta,
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaFin: row.fechaCargaFin
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await EspecialModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Especial(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await EspecialModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }

    async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await EspecialModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
