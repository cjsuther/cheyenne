import IContactoRepository from '../../../domain/repositories/contacto-repository';
import ContactoModel from './models/contacto-model';
import Contacto from '../../../domain/entities/contacto';
import ContactoState from '../../../domain/dto/contacto-state';

export default class ContactoRepositorySequelize implements IContactoRepository {

	constructor() {

	}

	async list() {
		const data = await ContactoModel.findAll();
		const result = data.map((row) => new Contacto(...row.getDataValues()));

		return result;
	}

	async listByEntidad(entidad:string, idEntidad:number) {
        const data = await ContactoModel.findAll({ where: { entidad: entidad, idEntidad: idEntidad } });
        const result = data.map((row) => new ContactoState(...row.getDataValues()));

        return result;
    }

	async findById(id:number) {
		const data = await ContactoModel.findOne({ where: { id: id } });
		const result = (data) ? new Contacto(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Contacto) {
		const data = await ContactoModel.create({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			idTipoContacto: row.idTipoContacto,
			detalle: row.detalle
		});
		const result = new Contacto(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Contacto) {
		const affectedCount = await ContactoModel.update({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			idTipoContacto: row.idTipoContacto,
			detalle: row.detalle
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ContactoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Contacto(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ContactoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEntidad(entidad:string, idEntidad:number) {
		const affectedCount = await ContactoModel.destroy({ where: { entidad: entidad, idEntidad: idEntidad } });
		const result = (affectedCount > 0) ? {idEntidad} : null;
		
		return result;
	}

}
