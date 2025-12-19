import IControladorCuentaRepository from '../../../domain/repositories/controlador-cuenta-repository';
import ControladorCuentaModel from './models/controlador-cuenta-model';
import ControladorCuenta from '../../../domain/entities/controlador-cuenta';
import TipoControladorModel from './models/tipo-controlador-model';
import TipoControlador from '../../../domain/entities/tipo-controlador';
import ControladorModel from './models/controlador-model';
import Controlador from '../../../domain/entities/controlador';

export default class ControladorCuentaRepositorySequelize implements IControladorCuentaRepository {

	constructor() {

	}

	async list() {
		const data = await ControladorCuentaModel.findAll();
		const result = data.map((row) => new ControladorCuenta(...row.getDataValues()));

		return result;
	}

	async listByCuenta(idCuenta: number) {
		const data = await ControladorCuentaModel.findAll({ where: { idCuenta: idCuenta },
			include: [
				{ model: TipoControladorModel, as: 'tipoControlador' },
				{ model: ControladorModel, as: 'controlador' }
            ]
		 });
		const result = data.map((row) => {
			const tipoControlador = row["tipoControlador"];
			const controlador = row["controlador"];

			let controladorCuenta = new ControladorCuenta(...row.getDataValues());
			if (tipoControlador){
				controladorCuenta.tipoControlador = new TipoControlador(...tipoControlador.getDataValues());
			}
			if (controlador) {
				controladorCuenta.controlador = new Controlador(...controlador.getDataValues());
			}

			return controladorCuenta;
		});

		return result;
	}

	async findById(id:number) {
		const data = await ControladorCuentaModel.findOne({ where: { id: id },
			include: [
				{ model: TipoControladorModel, as: 'tipoControlador' },
				{ model: ControladorModel, as: 'controlador' }
            ]
		});
		let result = null;
		if (data) {
			const tipoControlador = data["tipoControlador"];
			const controlador = data["controlador"];
			let controladorCuenta = new ControladorCuenta(...data.getDataValues());
			if (tipoControlador){
				controladorCuenta.tipoControlador = new TipoControlador(...tipoControlador.getDataValues());
			}
			if (controlador) {
				controladorCuenta.controlador = new Controlador(...controlador.getDataValues());
			}
			result = controladorCuenta;
		}

		return result;
	}

	async add(row:ControladorCuenta) {
		const data = await ControladorCuentaModel.create({
			idCuenta: row.idCuenta,
			idTipoControlador: row.idTipoControlador,
			idControlador: row.idControlador,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		});
		const result = new ControladorCuenta(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ControladorCuenta) {
		const affectedCount = await ControladorCuentaModel.update({
			idCuenta: row.idCuenta,
			idTipoControlador: row.idTipoControlador,
			idControlador: row.idControlador,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ControladorCuentaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ControladorCuenta(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ControladorCuentaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByCuenta(idCuenta: number) {
		const affectedCount = await ControladorCuentaModel.destroy({ where: { idCuenta: idCuenta } });
		const result = (affectedCount > 0) ? {idCuenta} : null;
		
		return result;
	}

}
