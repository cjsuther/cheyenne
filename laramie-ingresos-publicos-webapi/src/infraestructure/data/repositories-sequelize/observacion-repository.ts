import IObservacionRepository from '../../../domain/repositories/observacion-repository';
import ObservacionModel from './models/observacion-model';
import Observacion from '../../../domain/entities/observacion';
import ObservacionState from '../../../domain/dto/observacion-state';

export default class ObservacionRepositorySequelize implements IObservacionRepository {

	constructor() {

	}

	async list() {
		const data = await ObservacionModel.findAll();
		const result = data.map((row) => new Observacion(...row.getDataValues()));

		return result;
	}
	
	async listByEntidad(entidad:string, idEntidad:number) {
        const data = await ObservacionModel.findAll({ where: { entidad: entidad, idEntidad: idEntidad } });
        const result = data.map((row) => new ObservacionState(...row.getDataValues()));

        return result;
    }

	async listByInmueble(idInmueble:number) {
        const cursor = await ObservacionModel.sequelize.query(
            `SELECT * FROM observacion_inmueble_lista(:p_id_inmueble);`,
            {
                replacements: {
                    p_id_inmueble: idInmueble
                }
            }
        );
        const data = cursor[0] as any;
        const result = data.map((row) => {
            let item = new ObservacionState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.detalle = row.detalle;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async listByComercio(idComercio:number) {
        const cursor = await ObservacionModel.sequelize.query(
            `SELECT * FROM observacion_comercio_lista(:p_id_comercio);`,
            {
                replacements: {
                    p_id_comercio: idComercio
                }
            }
        );
        const data = cursor[0] as any;
        const result = data.map((row) => {
            let item = new ObservacionState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.detalle = row.detalle;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async listByVehiculo(idVehiculo:number) {
        const cursor = await ObservacionModel.sequelize.query(
            `SELECT * FROM observacion_vehiculo_lista(:p_id_vehiculo);`,
            {
                replacements: {
                    p_id_vehiculo: idVehiculo
                }
            }
        );
        const data = cursor[0] as any;
        const result = data.map((row) => {
            let item = new ObservacionState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.detalle = row.detalle;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

    async listByCementerio(idCementerio:number) {
        const cursor = await ObservacionModel.sequelize.query(
            `SELECT * FROM observacion_cementerio_lista(:p_id_cementerio);`,
            {
                replacements: {
                    p_id_cementerio: idCementerio
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new ObservacionState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.detalle = row.detalle;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async listByFondeadero(idFondeadero:number) {
        const cursor = await ObservacionModel.sequelize.query(
            `SELECT * FROM observacion_fondeadero_lista(:p_id_fondeadero);`,
            {
                replacements: {
                    p_id_fondeadero: idFondeadero
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new ObservacionState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.detalle = row.detalle;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

    async listByEspecial(idEspecial:number) {
        const cursor = await ObservacionModel.sequelize.query(
            `SELECT * FROM observacion_especial_lista(:p_id_especial);`,
            {
                replacements: {
                    p_id_especial: idEspecial
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new ObservacionState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.detalle = row.detalle;
			item.idUsuario = row.idUsuario;
			item.fecha = row.fecha;
            
            return item;
        });

        return result;
    }

	async findById(id:number) {
		const data = await ObservacionModel.findOne({ where: { id: id } });
		const result = (data) ? new Observacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Observacion) {
		const data = await ObservacionModel.create({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			detalle: row.detalle,
			idUsuario: row.idUsuario,
			fecha: row.fecha
		});
		const result = new Observacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Observacion) {
		const affectedCount = await ObservacionModel.update({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			detalle: row.detalle,
			idUsuario: row.idUsuario,
			fecha: row.fecha
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ObservacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Observacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ObservacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
