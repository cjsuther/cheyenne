import ICertificadoApremioItemRepository from '../../../domain/repositories/certificado-apremio-item-repository';
import CertificadoApremioItemModel from './models/certificado-apremio-item-model';
import CertificadoApremioItem from '../../../domain/entities/certificado-apremio-item';

export default class CertificadoApremioItemRepositorySequelize implements ICertificadoApremioItemRepository {

	constructor() {

	}

	async list() {
		const data = await CertificadoApremioItemModel.findAll();
		const result = data.map((row) => new CertificadoApremioItem(...row.getDataValues()));

		return result;
	}

	async listByCertificadoApremio(idCertificadoApremio: number) {
		const data = await CertificadoApremioItemModel.findAll({ where: { idCertificadoApremio: idCertificadoApremio } });
		const result = data.map((row) => new CertificadoApremioItem(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CertificadoApremioItemModel.findOne({ where: { id: id } });
		const result = (data) ? new CertificadoApremioItem(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CertificadoApremioItem) {
		const data = await CertificadoApremioItemModel.create({
			idCertificadoApremio: row.idCertificadoApremio,
			idCuentaCorrienteItem: row.idCuentaCorrienteItem,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			periodo: row.periodo,
			cuota: row.cuota,
			monto: row.monto,
			montoRecargo: row.montoRecargo,
			montoTotal: row.montoTotal
		});
		const result = new CertificadoApremioItem(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CertificadoApremioItem) {
		const affectedCount = await CertificadoApremioItemModel.update({
			idCertificadoApremio: row.idCertificadoApremio,
			idCuentaCorrienteItem: row.idCuentaCorrienteItem,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			periodo: row.periodo,
			cuota: row.cuota,
			monto: row.monto,
			montoRecargo: row.montoRecargo,
			montoTotal: row.montoTotal
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CertificadoApremioItemModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CertificadoApremioItem(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CertificadoApremioItemModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	
	async removeByCertificadoApremio(idCertificadoApremio: number) {
		const affectedCount = await CertificadoApremioItemModel.destroy({ where: { idCertificadoApremio: idCertificadoApremio } });
		const result = (affectedCount > 0) ? {idCertificadoApremio} : null;
		
		return result;
	}

}
