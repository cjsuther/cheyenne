import ICajaAsignacionRepository from '../../../domain/repositories/caja-asignacion-repository';
import Caja from '../../../domain/entities/caja';
import CajaAsignacion from '../../../domain/entities/caja-asignacion';
import CajaModel from './models/caja-model';
import CajaAsignacionModel from './models/caja-asignacion-model';
import './models/caja-associations-model';

export default class CajaAsignacionRepositorySequelize implements ICajaAsignacionRepository {

	constructor() {

	}

	async list() {
		const data = await CajaAsignacionModel.findAll();
		const result = data.map((row) => new CajaAsignacion(...row.getDataValues()));

		return result;
	}

	async listCierreTesoreria() {
		const data = await CajaAsignacionModel.findAll({
            include: [
				{ model: CajaModel, as: 'caja' }
            ],
			where: { idRecaudacionLote: null }
		});
		const result = data.map((row) => {
			const cajaAsignacion = new CajaAsignacion(...row.getDataValues());
			const rowCaja = row["caja"];
			if (rowCaja) {
				cajaAsignacion.caja = new Caja(...rowCaja.getDataValues());
			}

			return cajaAsignacion;
		});

		return result;
	}

	async listByCaja(idCaja: number) {
		const data = await CajaAsignacionModel.findAll({ where: { idCaja: idCaja } });
		const result = data.map((row) => new CajaAsignacion(...row.getDataValues()));

		return result;
	}

	async listByRecaudacionLote(idRecaudacionLote: number) {
		const data = await CajaAsignacionModel.findAll({ where: { idRecaudacionLote: idRecaudacionLote } });
		const result = data.map((row) => new CajaAsignacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CajaAsignacionModel.findOne({ where: { id: id } });
		const result = (data) ? new CajaAsignacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CajaAsignacion) {
		const data = await CajaAsignacionModel.create({
			idCaja: row.idCaja,
			idUsuario: row.idUsuario,
			fechaApertura: row.fechaApertura,
			fechaCierre: row.fechaCierre,
			importeSaldoInicial: row.importeSaldoInicial,
			importeSaldoFinal: row.importeSaldoFinal,
			importeCobro: row.importeCobro,
			importeCobroEfectivo: row.importeCobroEfectivo,
			idRecaudacionLote: row.idRecaudacionLote
		});
		const result = new CajaAsignacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CajaAsignacion) {
		const affectedCount = await CajaAsignacionModel.update({
			idCaja: row.idCaja,
			idUsuario: row.idUsuario,
			fechaApertura: row.fechaApertura,
			fechaCierre: row.fechaCierre,
			importeSaldoInicial: row.importeSaldoInicial,
			importeSaldoFinal: row.importeSaldoFinal,
			importeCobro: row.importeCobro,
			importeCobroEfectivo: row.importeCobroEfectivo,
			idRecaudacionLote: row.idRecaudacionLote
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CajaAsignacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CajaAsignacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CajaAsignacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
