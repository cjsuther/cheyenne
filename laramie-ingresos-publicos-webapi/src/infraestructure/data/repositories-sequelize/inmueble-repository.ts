import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IInmuebleRepository from '../../../domain/repositories/inmueble-repository';
import Inmueble from '../../../domain/entities/inmueble';
import InmuebleRow from '../../../domain/dto/inmueble-row';
import InmuebleModel from './models/inmueble-model';
import InmuebleFilter from '../../../domain/dto/inmueble-filter';
import CuentaCalculo from '../../../domain/dto/cuenta-calculo';
import CuentaOrdenamiento from '../../../domain/dto/cuenta-ordenamiento';


export default class InmuebleRepositorySequelize implements IInmuebleRepository {

    constructor() {

    }

    async listByCuenta(inmuebleFilter: InmuebleFilter) {
        const cursor = await InmuebleModel.sequelize.query(
            `SELECT * FROM inmueble_lista_cuenta(:p_numero_cuenta,:p_numero_web,:p_numero_documento,:p_id_persona,:p_etiqueta);`,
            {
                replacements: {
                    p_numero_cuenta: inmuebleFilter.numeroCuenta,
                    p_numero_web: inmuebleFilter.numeroWeb,
                    p_numero_documento: inmuebleFilter.numeroDocumento,
                    p_id_persona: inmuebleFilter.idPersona,
                    p_etiqueta: inmuebleFilter.etiqueta
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new InmuebleRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
            item.direccion = row.direccion?? "";
            
            return item;
        });

        return result;
    }

    async listByUbicacion(inmuebleFilter: InmuebleFilter) {
        const cursor = await InmuebleModel.sequelize.query(
            `SELECT * FROM inmueble_lista_ubicacion(:p_catastral,:p_direccion);`,
            {
                replacements: {
                    p_catastral: inmuebleFilter.catastral,
                    p_direccion: inmuebleFilter.direccion
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new InmuebleRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
            item.direccion = row.direccion?? "";
            
            return item;
        });

        return result;
    }

    async findById(id:number) {
        const data = await InmuebleModel.findOne({ where: { id: id } });
        const result = (data) ? new Inmueble(...data.getDataValues()) : null;

        return result;
    }

    async findByCuenta(idCuenta:number) {
        const data = await InmuebleModel.findOne({ where: { idCuenta: idCuenta } });
        const result = (data) ? new Inmueble(...data.getDataValues()) : null;

        return result;
    }

    async add(row:Inmueble) {
        const data = await InmuebleModel.create({
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaInicio: row.fechaCargaInicio,
            catastralCir: row.catastralCir,
            catastralSec: row.catastralSec,
            catastralChacra: row.catastralChacra,
            catastralLchacra: row.catastralLchacra,
            catastralQuinta: row.catastralQuinta,
            catastralLquinta: row.catastralLquinta,
            catastralFrac: row.catastralFrac,
            catastralLfrac: row.catastralLfrac,
            catastralManz: row.catastralManz,
            catastralLmanz: row.catastralLmanz,
            catastralParc: row.catastralParc,
            catastralLparc: row.catastralLparc,
            catastralSubparc: row.catastralSubparc,
            catastralUfunc: row.catastralUfunc,
            catastralUcomp: row.catastralUcomp,
            catastralRtasPrv: row.catastralRtasPrv,
            tributoManz: row.tributoManz,
            tributoLote: row.tributoLote,
            tributoEsquina: row.tributoEsquina
        });
        const result = new Inmueble(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Inmueble) {
        const affectedCount = await InmuebleModel.update({
            idCuenta: row.idCuenta,
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaFin: row.fechaCargaFin,
            catastralCir: row.catastralCir,
            catastralSec: row.catastralSec,
            catastralChacra: row.catastralChacra,
            catastralLchacra: row.catastralLchacra,
            catastralQuinta: row.catastralQuinta,
            catastralLquinta: row.catastralLquinta,            
            catastralFrac: row.catastralFrac,
            catastralLfrac: row.catastralLfrac,
            catastralManz: row.catastralManz,
            catastralLmanz: row.catastralLmanz,
            catastralParc: row.catastralParc,
            catastralLparc: row.catastralLparc,          
            catastralSubparc: row.catastralSubparc,
            catastralUfunc: row.catastralUfunc,
            catastralUcomp: row.catastralUcomp,
            catastralRtasPrv: row.catastralRtasPrv,
            tributoManz: row.tributoManz,
            tributoLote: row.tributoLote,
            tributoEsquina: row.tributoEsquina
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await InmuebleModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Inmueble(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await InmuebleModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }

    async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await InmuebleModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
