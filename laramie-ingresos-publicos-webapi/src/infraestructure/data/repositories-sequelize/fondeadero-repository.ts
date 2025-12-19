import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IFondeaderoRepository from '../../../domain/repositories/fondeadero-repository';
import Fondeadero from '../../../domain/entities/fondeadero';
import FondeaderoRow from '../../../domain/dto/fondeadero-row';
import FondeaderoModel from './models/fondeadero-model';
import FondeaderoFilter from '../../../domain/dto/fondeadero-filter';


export default class FondeaderoRepositorySequelize implements IFondeaderoRepository {

    constructor() {

    }

    async listByCuenta(fondeaderoFilter: FondeaderoFilter) {
        const cursor = await FondeaderoModel.sequelize.query(
            `SELECT * FROM fondeadero_lista_cuenta(:p_numero_cuenta,:p_numero_web,:p_numero_documento,:p_id_persona,:p_etiqueta);`,
            {
                replacements: {
                    p_numero_cuenta: fondeaderoFilter.numeroCuenta,
                    p_numero_web: fondeaderoFilter.numeroWeb,
                    p_numero_documento: fondeaderoFilter.numeroDocumento,
                    p_id_persona: fondeaderoFilter.idPersona,
                    p_etiqueta: fondeaderoFilter.etiqueta
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new FondeaderoRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
            item.descripcionTasa = row.tasa_descripcion;
			item.descripcionSubTasa = row.sub_tasa_descripcion;
			item.embarcacion = row.embarcacion;
            
            return item;
        });

        return result;
    }

    async listByDatos(fondeaderoFilter: FondeaderoFilter) {
        const cursor = await FondeaderoModel.sequelize.query(
            `SELECT * FROM fondeadero_lista_datos(:p_id_tasa,:p_id_subtasa,:p_embarcacion);`,
            {
                replacements: {
                    p_id_tasa: fondeaderoFilter.idTasa,
                    p_id_subtasa: fondeaderoFilter.idSubTasa,
                    p_embarcacion: fondeaderoFilter.embarcacion
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new FondeaderoRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
			item.descripcionTasa = row.tasa_descripcion;
			item.descripcionSubTasa = row.sub_tasa_descripcion;
			item.embarcacion = row.embarcacion;
            
            return item;
        });

        return result;
    }

    async findById(id:number) {
        const data = await FondeaderoModel.findOne({ where: { id: id } });
        const result = (data) ? new Fondeadero(...data.getDataValues()) : null;

        return result;
    }

    async add(row:Fondeadero) {
        const data = await FondeaderoModel.create({
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaInicio: row.fechaCargaInicio,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			embarcacion: row.embarcacion,
			superficie: row.superficie,
			longitud: row.longitud,
			codigo: row.codigo,
			club: row.club,
			digitoVerificador: row.digitoVerificador,
			ubicacion: row.ubicacion,
			margen: row.margen,
			fechaAlta: row.fechaAlta
        });
        const result = new Fondeadero(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Fondeadero) {
        const affectedCount = await FondeaderoModel.update({
            idCuenta: row.idCuenta,
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaFin: row.fechaCargaFin,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			embarcacion: row.embarcacion,
			superficie: row.superficie,
			longitud: row.longitud,
			codigo: row.codigo,
			club: row.club,
			digitoVerificador: row.digitoVerificador,
			ubicacion: row.ubicacion,
			margen: row.margen,
			fechaAlta: row.fechaAlta
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await FondeaderoModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Fondeadero(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await FondeaderoModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }

    async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await FondeaderoModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
