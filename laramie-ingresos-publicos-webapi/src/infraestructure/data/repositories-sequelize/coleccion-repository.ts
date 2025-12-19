import IColeccionRepository from '../../../domain/repositories/coleccion-repository';
import ColeccionModel from './models/coleccion-model';
import Coleccion from '../../../domain/entities/coleccion';
import ColeccionCampoModel from './models/coleccion-campo-model';
import ColeccionCampo from '../../../domain/entities/coleccion-campo';
import { castDataType } from '../../sdk/utils/convert';

export default class ColeccionRepositorySequelize implements IColeccionRepository {

	constructor() {

	}

	async list() {
		const data = await ColeccionModel.findAll({
            include: [
				{ model: ColeccionCampoModel, as: 'coleccionCampo' }
            ]
		});
		const result = data.map((row) => {
			const coleccionCampo = row["coleccionCampo"];

			let coleccion = new Coleccion(...row.getDataValues());
			coleccion.coleccionesCampo = (coleccionCampo.map((detalle) => new ColeccionCampo(...detalle.getDataValues())) as Array<ColeccionCampo>).sort((a, b) => a.id - b.id);
			
			return coleccion;
		});

		return result;
	}

	async findById(id:number) {
		const data = await ColeccionModel.findOne({ where: { id: id } });
		const result = (data) ? new Coleccion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Coleccion) {
		const data = await ColeccionModel.create({
			idTipoTributo: row.idTipoTributo,
			nombre: row.nombre,
			descripcion: row.descripcion,
			ejecucion: row.ejecucion
		});
		const result = new Coleccion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Coleccion) {
		const affectedCount = await ColeccionModel.update({
			idTipoTributo: row.idTipoTributo,
			nombre: row.nombre,
			descripcion: row.descripcion,
			ejecucion: row.ejecucion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ColeccionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Coleccion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ColeccionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async execute(row:Coleccion, idCuenta:number, idEmisionEjecucion:number, idTasa:number, idSubTasa:number, periodo:number, mes:number) {
        const cursor = await ColeccionModel.sequelize.query(
			`SELECT * FROM ${row.ejecucion}(:p_id_cuenta,:p_id_emision_ejecucion,:p_id_tasa,:p_id_sub_tasa,:p_periodo,:p_mes);`,
            {
                replacements: {
                    p_id_cuenta: idCuenta,
					p_id_emision_ejecucion: idEmisionEjecucion,
					p_id_tasa: idTasa,
					p_id_sub_tasa: idSubTasa,
                    p_periodo: periodo,
                    p_mes: mes
                }
            }
        );
        const data = cursor[0] as any;
       
        const result = data.map(item => {
			let newItem = {};
			row.coleccionesCampo.forEach(campo => {
				if (campo.tipoDato === "decimal")
					newItem[campo.codigo] = parseFloat(item[campo.campo]);
				else
					newItem[campo.codigo] = item[campo.campo];
			});

            return newItem;
        });

        return result;
    }

}
