import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import ICertificadoApremioRepository from '../../../domain/repositories/certificado-apremio-repository';
import CertificadoApremioModel from './models/certificado-apremio-model';
import CertificadoApremio from '../../../domain/entities/certificado-apremio';
import CertificadoApremioFilter from '../../../domain/dto/certificado-apremio-filter';
import CertificadoApremioRow from '../../../domain/dto/certificado-apremio-row';

export default class CertificadoApremioRepositorySequelize implements ICertificadoApremioRepository {

	constructor() {

	}

	async list() {
		const data = await CertificadoApremioModel.findAll();
		const result = data.map((row) => new CertificadoApremio(...row.getDataValues()));

		return result;
	}

	async listByFilter(certificadoApremioFilter: CertificadoApremioFilter) {
        const cursor = await CertificadoApremioModel.sequelize.query(
            `SELECT * FROM certificado_apremio_lista(:p_id_apremio,:p_id_cuenta,:p_id_estado_certificado_apremio,:p_numero,:p_fecha_certificado_desde,:p_fecha_certificado_hasta);`,
            {
                replacements: {
					p_id_apremio: certificadoApremioFilter.idApremio,
					p_id_cuenta: certificadoApremioFilter.idCuenta,
					p_id_estado_certificado_apremio: certificadoApremioFilter.idEstadoCertificadoApremio,
					p_numero: certificadoApremioFilter.numero,
					p_fecha_certificado_desde: certificadoApremioFilter.fechaCertificadoDesde,
					p_fecha_certificado_hasta: certificadoApremioFilter.fechaCertificadoHasta
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new CertificadoApremioRow();
			item.id = row.id;
			item.idApremio = row.id_apremio;
			item.idEstadoCertificadoApremio = row.id_estado_certificado_apremio;
			item.numero = row.numero;
			item.idCuenta = row.id_cuenta;
			item.idInspeccion = row.id_inspeccion;
			item.montoTotal = parseFloat(row.monto_total);
			item.fechaCertificado = row.fecha_certificado;
			item.fechaCalculo = row.fecha_calculo;
			item.fechaNotificacion = row.fecha_notificacion;
			item.fechaRecepcion = row.fecha_recepcion;
			item.numeroApremio = row.numero_apremio;
			item.numeroCuenta = row.numero_cuenta;
			item.idContribuyente = row.id_contribuyente;
			item.idTipoDocumentoContribuyente = row.id_tipo_documento_contribuyente;
			item.numeroDocumentoContribuyente = row.numero_documento_contribuyente;
			item.nombreContribuyente = row.nombre_contribuyente;
			   
            return item;
        });

        return result;
    }

	async listByApremio(idApremio: number) {
		const data = await CertificadoApremioModel.findAll({ where: { idApremio: idApremio } });
		const result = data.map((row) => new CertificadoApremio(...row.getDataValues()));

		return result;
	}

	async listByCuenta(idCuenta: number) {
		const data = await CertificadoApremioModel.findAll({ where: { idCuenta: idCuenta } });
		const result = data.map((row) => new CertificadoApremio(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CertificadoApremioModel.findOne({ where: { id: id } });
		const result = (data) ? new CertificadoApremio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CertificadoApremio) {
		const data = await CertificadoApremioModel.create({
			idApremio: row.idApremio,
			idEstadoCertificadoApremio: row.idEstadoCertificadoApremio,
			numero: row.numero,
			idCuenta: row.idCuenta,
			idInspeccion: row.idInspeccion,
			montoTotal: row.montoTotal,
			fechaCertificado: row.fechaCertificado,
			fechaCalculo: row.fechaCalculo,
			fechaNotificacion: row.fechaNotificacion,
			fechaRecepcion: row.fechaRecepcion
		});
		const result = new CertificadoApremio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CertificadoApremio) {
		const affectedCount = await CertificadoApremioModel.update({
			idApremio: row.idApremio,
			idEstadoCertificadoApremio: row.idEstadoCertificadoApremio,
			idInspeccion: row.idInspeccion,
			fechaNotificacion: row.fechaNotificacion,
			fechaRecepcion: row.fechaRecepcion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CertificadoApremioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CertificadoApremio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CertificadoApremioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await CertificadoApremioModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
