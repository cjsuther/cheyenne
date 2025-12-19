import ISubTasaImputacionRepository from '../../../domain/repositories/sub-tasa-imputacion-repository';
import SubTasaImputacionModel from './models/sub-tasa-imputacion-model';
import SubTasaImputacion from '../../../domain/entities/sub-tasa-imputacion';
import SubTasaImputacionState from '../../../domain/dto/sub-tasa-imputacion-state';

export default class SubTasaImputacionRepositorySequelize implements ISubTasaImputacionRepository {

	constructor() {

	}

	async listBySubTasa(idSubTasa: number) {
		const data = await SubTasaImputacionModel.findAll({where: { idSubTasa: idSubTasa }});
		const result = data.map((row) => new SubTasaImputacionState(...row.getDataValues()));

		return result;
	}
	async findById(id:number) {
		const data = await SubTasaImputacionModel.findOne({ where: { id: id } });
		const result = (data) ? new SubTasaImputacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:SubTasaImputacion) {
		const data = await SubTasaImputacionModel.create({
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			ejercicio: row.ejercicio,
			idTipoCuota: row.idTipoCuota,
			idCuentaContable: row.idCuentaContable,
			idCuentaContableAnterior: row.idCuentaContableAnterior,
			idCuentaContableFutura: row.idCuentaContableFutura,
			idJurisdiccionActual: row.idJurisdiccionActual,
			idRecursoPorRubroActual: row.idRecursoPorRubroActual,
			idJurisdiccionAnterior: row.idJurisdiccionAnterior,
			idRecursoPorRubroAnterior: row.idRecursoPorRubroAnterior,
			idJurisdiccionFutura: row.idJurisdiccionFutura,
			idRecursoPorRubroFutura: row.idRecursoPorRubroFutura
		});
		const result = new SubTasaImputacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:SubTasaImputacion) {
		const affectedCount = await SubTasaImputacionModel.update({
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			ejercicio: row.ejercicio,
			idTipoCuota: row.idTipoCuota,
			idCuentaContable: row.idCuentaContable,
			idCuentaContableAnterior: row.idCuentaContableAnterior,
			idCuentaContableFutura: row.idCuentaContableFutura,
			idJurisdiccionActual: row.idJurisdiccionActual,
			idRecursoPorRubroActual: row.idRecursoPorRubroActual,
			idJurisdiccionAnterior: row.idJurisdiccionAnterior,
			idRecursoPorRubroAnterior: row.idRecursoPorRubroAnterior,
			idJurisdiccionFutura: row.idJurisdiccionFutura,
			idRecursoPorRubroFutura: row.idRecursoPorRubroFutura
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await SubTasaImputacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new SubTasaImputacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await SubTasaImputacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeBySubTasa(idSubTasa: number) {
		const affectedCount = await SubTasaImputacionModel.destroy({ where: { idSubTasa: idSubTasa } });
		const result = (affectedCount > 0) ? {idSubTasa} : null;
		
		return result;
	}

}
