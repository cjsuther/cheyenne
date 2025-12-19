import IEtiquetaRepository from '../../../domain/repositories/etiqueta-repository';
import EtiquetaModel from './models/etiqueta-model';
import Etiqueta from '../../../domain/entities/etiqueta';
import EtiquetaState from '../../../domain/dto/etiqueta-state';

export default class EtiquetaRepositorySequelize implements IEtiquetaRepository {

	constructor() {

	}

	async list() {
		const data = await EtiquetaModel.findAll();
		const result = data.map((row) => new Etiqueta(...row.getDataValues()));

		return result;
	}

    async listByEntidad(entidad:string, idEntidad:number) {
        const data = await EtiquetaModel.findAll({ where: { entidad: entidad, idEntidad: idEntidad } });
        const result = data.map((row) => new EtiquetaState(...row.getDataValues()));

        return result;
    }

    async listByCodigo(codigo:string) {
        const data = await EtiquetaModel.findAll({ where: { codigo: codigo } });
        const result = data.map((row) => new EtiquetaState(...row.getDataValues()));

        return result;
    }

	async listByInmueble(idInmueble:number) {
        const cursor = await EtiquetaModel.sequelize.query(
            `SELECT * FROM etiqueta_inmueble_lista(:p_id_inmueble);`,
            {
                replacements: {
                    p_id_inmueble: idInmueble
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new EtiquetaState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.codigo = row.codigo;
            
            return item;
        });

        return result;
    }

	async listByComercio(idComercio:number) {
        const cursor = await EtiquetaModel.sequelize.query(
            `SELECT * FROM etiqueta_comercio_lista(:p_id_comercio);`,
            {
                replacements: {
                    p_id_comercio: idComercio
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new EtiquetaState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.codigo = row.codigo;
            
            return item;
        });

        return result;
    }

	async listByVehiculo(idVehiculo:number) {
        const cursor = await EtiquetaModel.sequelize.query(
            `SELECT * FROM etiqueta_vehiculo_lista(:p_id_vehiculo);`,
            {
                replacements: {
                    p_id_vehiculo: idVehiculo
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new EtiquetaState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.codigo = row.codigo;
            
            return item;
        });

        return result;
    }

    async listByCementerio(idCementerio:number) {
        const cursor = await EtiquetaModel.sequelize.query(
            `SELECT * FROM etiqueta_cementerio_lista(:p_id_cementerio);`,
            {
                replacements: {
                    p_id_cementerio: idCementerio
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new EtiquetaState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.codigo = row.codigo;
            
            return item;
        });

        return result;
    }

	async listByFondeadero(idFondeadero:number) {
        const cursor = await EtiquetaModel.sequelize.query(
            `SELECT * FROM etiqueta_fondeadero_lista(:p_id_fondeadero);`,
            {
                replacements: {
                    p_id_fondeadero: idFondeadero
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new EtiquetaState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.codigo = row.codigo;
            
            return item;
        });

        return result;
    }

	async listByEspecial(idEspecial:number) {
        const cursor = await EtiquetaModel.sequelize.query(
            `SELECT * FROM etiqueta_especial_lista(:p_id_especial);`,
            {
                replacements: {
                    p_id_especial: idEspecial
                }
            }
        );
        const data = cursor[0] as any;
		const result = data.map((row) => {
            let item = new EtiquetaState();
            item.id = row.id;
            item.entidad = row.entidad;
            item.idEntidad = row.id_entidad;
            item.codigo = row.codigo;
            
            return item;
        });

        return result;
    }

	async findById(id:number) {
		const data = await EtiquetaModel.findOne({ where: { id: id } });
		const result = (data) ? new Etiqueta(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Etiqueta) {
		const data = await EtiquetaModel.create({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			codigo: row.codigo
		});
		const result = new Etiqueta(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Etiqueta) {
		const affectedCount = await EtiquetaModel.update({
			entidad: row.entidad,
			idEntidad: row.idEntidad,
			codigo: row.codigo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EtiquetaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Etiqueta(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EtiquetaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
