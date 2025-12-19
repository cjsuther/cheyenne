import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IComercioRepository from '../../../domain/repositories/comercio-repository';
import Comercio from '../../../domain/entities/comercio';
import ComercioRow from '../../../domain/dto/comercio-row';
import ComercioModel from './models/comercio-model';
import ComercioFilter from '../../../domain/dto/comercio-filter';


export default class ComercioRepositorySequelize implements IComercioRepository {

    constructor() {

    }

    async listByCuenta(comercioFilter: ComercioFilter) {
        const cursor = await ComercioModel.sequelize.query(
            `SELECT * FROM comercio_lista_cuenta(:p_numero_cuenta,:p_numero_web,:p_numero_documento,:p_id_persona,:p_etiqueta);`,
            {
                replacements: {
                    p_numero_cuenta: comercioFilter.numeroCuenta,
                    p_numero_web: comercioFilter.numeroWeb,
                    p_numero_documento: comercioFilter.numeroDocumento,
                    p_id_persona: comercioFilter.idPersona,
                    p_etiqueta: comercioFilter.etiqueta
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new ComercioRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
            item.cuentaInmueble = row.cuenta_inmueble;
            item.rubro = row.rubro;
			item.nombreFantasia = row.nombre_fantasia;
            
            return item;
        });

        return result;
    }

    async listByDatos(comercioFilter: ComercioFilter) {
        const cursor = await ComercioModel.sequelize.query(
            `SELECT * FROM comercio_lista_datos(:p_cuenta_inmueble,:p_rubro,:p_nombre_fantasia);`,
            {
                replacements: {
                    p_cuenta_inmueble: comercioFilter.cuentaInmueble,
                    p_rubro: comercioFilter.rubro,
                    p_nombre_fantasia: comercioFilter.nombreFantasia
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new ComercioRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
			item.cuentaInmueble = row.cuenta_inmueble;
			item.rubro = row.rubro;
			item.nombreFantasia = row.nombre_fantasia;
            
            return item;
        });

        return result;
    }

    async findById(id:number) {
        const data = await ComercioModel.findOne({ where: { id: id } });
        const result = (data) ? new Comercio(...data.getDataValues()) : null;

        return result;
    }

    async add(row:Comercio) {
        const data = await ComercioModel.create({
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaInicio: row.fechaCargaInicio,
            idRubro: row.idRubro,
            idCuentaInmueble: row.idCuentaInmueble,
            nombreFantasia: row.nombreFantasia,
            digitoVerificador: row.digitoVerificador,
            granContribuyente: row.granContribuyente
        });
        const result = new Comercio(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Comercio) {
        const affectedCount = await ComercioModel.update({
            idCuenta: row.idCuenta,
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaFin: row.fechaCargaFin,
			idRubro: row.idRubro,
            idCuentaInmueble: row.idCuentaInmueble,
            nombreFantasia: row.nombreFantasia,
            digitoVerificador: row.digitoVerificador,
            granContribuyente: row.granContribuyente,
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await ComercioModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Comercio(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await ComercioModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }

    async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await ComercioModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
