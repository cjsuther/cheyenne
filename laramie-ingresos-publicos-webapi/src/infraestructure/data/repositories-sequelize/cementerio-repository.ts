import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import ICementerioRepository from '../../../domain/repositories/cementerio-repository';
import Cementerio from '../../../domain/entities/cementerio';
import CementerioRow from '../../../domain/dto/cementerio-row';
import CementerioModel from './models/cementerio-model';
import CementerioFilter from '../../../domain/dto/cementerio-filter';


export default class CementerioRepositorySequelize implements ICementerioRepository {

    constructor() {

    }

    async listByCuenta(cementerioFilter: CementerioFilter) {
        const cursor = await CementerioModel.sequelize.query(
            `SELECT * FROM cementerio_lista_cuenta(:p_numero_cuenta,:p_numero_web,:p_numero_documento,:p_id_persona,:p_etiqueta);`,
            {
                replacements: {
                    p_numero_cuenta: cementerioFilter.numeroCuenta,
                    p_numero_web: cementerioFilter.numeroWeb,
                    p_numero_documento: cementerioFilter.numeroDocumento,
                    p_id_persona: cementerioFilter.idPersona,
                    p_etiqueta: cementerioFilter.etiqueta
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new CementerioRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
            item.idTipoDocumentoInhumado = row.id_tipo_documento_inhumado;
            item.numeroDocumentoInhumado = row.numero_documento_inhumado;
            item.nombreInhumado = row.nombre_inhumado;
            item.apellidoInhumado = row.apellido_inhumado;
            
            return item;
        });

        return result;
    }

    async listByDatos(cementerioFilter: CementerioFilter) {
        const cursor = await CementerioModel.sequelize.query(
            `SELECT * FROM cementerio_lista_datos(:p_numero_documento_inhumado,:p_nombre_apellido_inhumado);`,
            {
                replacements: {
                    p_numero_documento_inhumado: cementerioFilter.numeroDocumentoInhumado,
                    p_nombre_apellido_inhumado: cementerioFilter.nombreApellidoInhumado
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new CementerioRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
            item.idTipoDocumentoInhumado = row.id_tipo_documento_inhumado;
            item.numeroDocumentoInhumado = row.numero_documento_inhumado;
            item.nombreInhumado = row.nombre_inhumado;
            item.apellidoInhumado = row.apellido_inhumado;
            
            return item;
        });

        return result;
    }

    async findById(id:number) {
        const data = await CementerioModel.findOne({ where: { id: id } });
        const result = (data) ? new Cementerio(...data.getDataValues()) : null;

        return result;
    }

    async add(row:Cementerio) {
        const data = await CementerioModel.create({
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaInicio: row.fechaCargaInicio,
			idTipoConstruccionFuneraria: row.idTipoConstruccionFuneraria,
			idCementerio: row.idCementerio,
			circunscripcionCementerio: row.circunscripcionCementerio,
			seccionCementerio: row.seccionCementerio,
			manzanaCementerio: row.manzanaCementerio,
			parcelaCementerio: row.parcelaCementerio,
			frenteCementerio: row.frenteCementerio,
			filaCementerio: row.filaCementerio,
			numeroCementerio: row.numeroCementerio,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja,
			fechaPresentacion: row.fechaPresentacion,
			digitoVerificador: row.digitoVerificador,
			fechaConcesion: row.fechaConcesion,
			fechaEscritura: row.fechaEscritura,
			fechaSucesion: row.fechaSucesion,
			libroEscritura: row.libroEscritura,
			folioEscritura: row.folioEscritura,
			numeroSucesion: row.numeroSucesion,
			superficie: row.superficie,
			largo: row.largo,
			ancho: row.ancho            
        });
        const result = new Cementerio(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Cementerio) {
        const affectedCount = await CementerioModel.update({
            idCuenta: row.idCuenta,
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaFin: row.fechaCargaFin,
			idTipoConstruccionFuneraria: row.idTipoConstruccionFuneraria,
			idCementerio: row.idCementerio,
			circunscripcionCementerio: row.circunscripcionCementerio,
			seccionCementerio: row.seccionCementerio,
			manzanaCementerio: row.manzanaCementerio,
			parcelaCementerio: row.parcelaCementerio,
			frenteCementerio: row.frenteCementerio,
			filaCementerio: row.filaCementerio,
			numeroCementerio: row.numeroCementerio,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja,
			fechaPresentacion: row.fechaPresentacion,
			digitoVerificador: row.digitoVerificador,
			fechaConcesion: row.fechaConcesion,
			fechaEscritura: row.fechaEscritura,
			fechaSucesion: row.fechaSucesion,
			libroEscritura: row.libroEscritura,
			folioEscritura: row.folioEscritura,
			numeroSucesion: row.numeroSucesion,
			superficie: row.superficie,
			largo: row.largo,
			ancho: row.ancho
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await CementerioModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Cementerio(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await CementerioModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }

    async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await CementerioModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
