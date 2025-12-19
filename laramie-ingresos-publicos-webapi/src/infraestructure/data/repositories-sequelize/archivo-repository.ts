import IArchivoRepository from '../../../domain/repositories/archivo-repository';
import ArchivoModel from './models/archivo-model';
import Archivo from '../../../domain/entities/archivo';
import ArchivoState from '../../../domain/dto/archivo-state';

export default class ArchivoRepositorySequelize implements IArchivoRepository {

	constructor() {

	}

	async list() {
		const data = await ArchivoModel.findAll();
		const result = data.map((row) => new Archivo(...row.getDataValues()));

		return result;
	}

	async listByEntidad(entidad:string, idEntidad:number) {
        const data = await ArchivoModel.findAll({ where: { entidad: entidad, idEntidad: idEntidad } });
        const result = data.map((row) => new ArchivoState(...row.getDataValues()));

        return result;
    }

	async listByInmueble(idInmueble:number) {
        const cursor = await ArchivoModel.sequelize.query(
            `SELECT * FROM archivo_inmueble_lista(:p_id_inmueble);`,
            {
                replacements: {
                    p_id_inmueble: idInmueble
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new ArchivoState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.nombre = row.nombre;
			item.path = row.path;
			item.descripcion = row.descripcion;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }
	
	async listByComercio(idComercio:number) {
        const cursor = await ArchivoModel.sequelize.query(
            `SELECT * FROM archivo_comercio_lista(:p_id_comercio);`,
            {
                replacements: {
                    p_id_comercio: idComercio
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new ArchivoState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.nombre = row.nombre;
			item.path = row.path;
			item.descripcion = row.descripcion;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async listByVehiculo(idVehiculo:number) {
        const cursor = await ArchivoModel.sequelize.query(
            `SELECT * FROM archivo_vehiculo_lista(:p_id_vehiculo);`,
            {
                replacements: {
                    p_id_vehiculo: idVehiculo
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new ArchivoState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.nombre = row.nombre;
			item.path = row.path;
			item.descripcion = row.descripcion;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async listByCementerio(idCementerio:number) {
        const cursor = await ArchivoModel.sequelize.query(
            `SELECT * FROM archivo_cementerio_lista(:p_id_cementerio);`,
            {
                replacements: {
                    p_id_cementerio: idCementerio
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new ArchivoState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.nombre = row.nombre;
			item.path = row.path;
			item.descripcion = row.descripcion;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async listByFondeadero(idFondeadero:number) {
        const cursor = await ArchivoModel.sequelize.query(
            `SELECT * FROM archivo_fondeadero_lista(:p_id_fondeadero);`,
            {
                replacements: {
                    p_id_fondeadero: idFondeadero
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new ArchivoState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.nombre = row.nombre;
			item.path = row.path;
			item.descripcion = row.descripcion;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async listByEspecial(idEspecial:number) {
        const cursor = await ArchivoModel.sequelize.query(
            `SELECT * FROM archivo_especial_lista(:p_id_especial);`,
            {
                replacements: {
                    p_id_especial: idEspecial
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new ArchivoState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.nombre = row.nombre;
			item.path = row.path;
			item.descripcion = row.descripcion;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async findById(id:number) {
		const data = await ArchivoModel.findOne({ where: { id: id } });
		const result = (data) ? new Archivo(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Archivo) {
		const data = await ArchivoModel.create({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			nombre: row.nombre,
			path: row.path,
			descripcion: row.descripcion,
			idUsuario: row.idUsuario,
			fecha: row.fecha
		});
		const result = new Archivo(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Archivo) {
		const affectedCount = await ArchivoModel.update({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			nombre: row.nombre,
			path: row.path,
			descripcion: row.descripcion,
			idUsuario: row.idUsuario,
			fecha: row.fecha
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ArchivoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Archivo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ArchivoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
