import { Sequelize, Op } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IProcedimientoRepository from '../../../domain/repositories/procedimiento-repository';
import ProcedimientoModel from './models/procedimiento-model';
import Procedimiento from '../../../domain/entities/procedimiento';
import ProcedimientoParametroModel from './models/procedimiento-parametro-model';
import ProcedimientoVariableModel from './models/procedimiento-variable-model';
import ProcedimientoParametro from '../../../domain/entities/procedimiento-parametro';
import ProcedimientoVariable from '../../../domain/entities/procedimiento-variable';

export default class ProcedimientoRepositorySequelize implements IProcedimientoRepository {

	constructor() {

	}

	async list() {
		const data = await ProcedimientoModel.findAll({
            include: [
				{ model: ProcedimientoParametroModel, as: 'procedimientoParametro' },
				{ model: ProcedimientoVariableModel, as: 'procedimientoVariable' }
            ]
		});
		const result = data.map((row) => {
			const procedimientoParametro = row["procedimientoParametro"];
			const procedimientoVariable = row["procedimientoVariable"];

			let procedimiento = new Procedimiento(...row.getDataValues());
			procedimiento.procedimientoParametros = (procedimientoParametro.map((detalle) => new ProcedimientoParametro(...detalle.getDataValues())) as Array<ProcedimientoParametro>).sort((a, b) => a.orden - b.orden);
			procedimiento.procedimientoVariables = (procedimientoVariable.map((detalle) => new ProcedimientoVariable(...detalle.getDataValues())) as Array<ProcedimientoVariable>).sort((a, b) => a.orden - b.orden);

			return procedimiento;
		});

		return result;
	}

	async findById(id:number) {
		const data = await ProcedimientoModel.findOne({ where: { id: id },
            include: [
				{ model: ProcedimientoParametroModel, as: 'procedimientoParametro' },
				{ model: ProcedimientoVariableModel, as: 'procedimientoVariable' }
            ]
		});
		let result = null;
		if (data) {
			const procedimientoParametro = data["procedimientoParametro"];
			const procedimientoVariable = data["procedimientoVariable"];
			let procedimiento = new Procedimiento(...data.getDataValues());
			procedimiento.procedimientoParametros = (procedimientoParametro.map((detalle) => new ProcedimientoParametro(...detalle.getDataValues())) as Array<ProcedimientoParametro>).sort((a, b) => a.id - b.id);
			procedimiento.procedimientoVariables = (procedimientoVariable.map((detalle) => new ProcedimientoVariable(...detalle.getDataValues())) as Array<ProcedimientoVariable>).sort((a, b) => a.id - b.id);
			result = procedimiento;
		}

		return result;
	}

	async add(row:Procedimiento) {
		const data = await ProcedimientoModel.create({
			idEstadoProcedimiento: row.idEstadoProcedimiento,
			idTipoTributo: row.idTipoTributo,
			nombre: row.nombre,
			descripcion: row.descripcion,
			idUsuarioCreacion: row.idUsuarioCreacion,
			fechaCreacion: row.fechaCreacion
		});
		const result = new Procedimiento(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Procedimiento) {
		const affectedCount = await ProcedimientoModel.update({
			idEstadoProcedimiento: row.idEstadoProcedimiento,
			idTipoTributo: row.idTipoTributo,
			nombre: row.nombre,
			descripcion: row.descripcion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ProcedimientoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Procedimiento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ProcedimientoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await ProcedimientoModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
