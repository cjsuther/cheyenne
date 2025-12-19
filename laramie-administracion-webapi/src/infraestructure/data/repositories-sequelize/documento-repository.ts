import IDocumentoRepository from '../../../domain/repositories/documento-repository';
import DocumentoModel from './models/documento-model';
import Documento from '../../../domain/entities/documento';
import DocumentoState from '../../../domain/dto/documento-state';

export default class DocumentoRepositorySequelize implements IDocumentoRepository {

	constructor() {

	}

	async list() {
		const data = await DocumentoModel.findAll();
		const result = data.map((row) => new Documento(...row.getDataValues()));

		return result;
	}
	
	async listByPersona(idTipoPersona:number, idPersona:number) {
		const data = await DocumentoModel.findAll({ where: { idTipoPersona: idTipoPersona, idPersona: idPersona } });
		const result = data.map((row) => new DocumentoState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await DocumentoModel.findOne({ where: { id: id } });
		const result = (data) ? new Documento(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Documento) {
		const data = await DocumentoModel.create({
			idTipoPersona: row.idTipoPersona,
			idPersona: row.idPersona,
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento,
			principal: row.principal
		});
		const result = new Documento(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Documento) {
		const affectedCount = await DocumentoModel.update({
			idTipoPersona: row.idTipoPersona,
			idPersona: row.idPersona,
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento,
			principal: row.principal
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await DocumentoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Documento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await DocumentoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPersona(idTipoPersona:number, idPersona:number) {
		const affectedCount = await DocumentoModel.destroy({ where: { idTipoPersona: idTipoPersona, idPersona: idPersona } });
		const result = (affectedCount > 0) ? {idPersona} : null;
		
		return result;
	}

}
