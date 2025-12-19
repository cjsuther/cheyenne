import { Sequelize, Op } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IPagoContadoDefinicionRepository from '../../../domain/repositories/pago-contado-definicion-repository';
import PagoContadoDefinicionModel from './models/pago-contado-definicion-model';
import PagoContadoDefinicion from '../../../domain/entities/pago-contado-definicion';
import PagoContadoDefinicionFilter from '../../../domain/dto/pago-contado-definicion-filter';
import { isNull } from '../../sdk/utils/validator';
import TipoPlanPago from '../../../domain/entities/tipo-plan-pago';
import TipoPlanPagoModel from './models/tipo-plan-pago-model';

export default class PagoContadoDefinicionRepositorySequelize implements IPagoContadoDefinicionRepository {

	constructor() {

	}

	async list() {
		const data = await PagoContadoDefinicionModel.findAll({
			include: [
				{ model: TipoPlanPagoModel, as: 'tipoPlanPago' }
            ]
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async listByFilter(pagoContadoDefinicionFilter: PagoContadoDefinicionFilter) {

		let filters = {};
		if (pagoContadoDefinicionFilter.idTipoPlanPago > 0) filters["idTipoPlanPago"] = pagoContadoDefinicionFilter.idTipoPlanPago;
		if (pagoContadoDefinicionFilter.idTipoTributo > 0) filters["idTipoTributo"] = pagoContadoDefinicionFilter.idTipoTributo;
		if (pagoContadoDefinicionFilter.idTasaPagoContado > 0) filters["idTasaPagoContado"] = pagoContadoDefinicionFilter.idTasaPagoContado;
		if (pagoContadoDefinicionFilter.idSubTasaPagoContado > 0) filters["idSubTasaPagoContado"] = pagoContadoDefinicionFilter.idSubTasaPagoContado;
		if (pagoContadoDefinicionFilter.idEstadoPagoContadoDefinicion > 0) filters["idEstadoPagoContadoDefinicion"] = pagoContadoDefinicionFilter.idEstadoPagoContadoDefinicion;
		if (pagoContadoDefinicionFilter.descripcion.length > 0) {
			filters["descripcion"] = {
				[Op.iLike]: `%${pagoContadoDefinicionFilter.descripcion}%`
			};
		}

		let data = null;
		if (pagoContadoDefinicionFilter.idTipoPlanPago === 0 &&
			pagoContadoDefinicionFilter.idTipoTributo === 0 &&
			pagoContadoDefinicionFilter.idTasaPagoContado === 0 &&
			pagoContadoDefinicionFilter.idSubTasaPagoContado === 0 &&
			pagoContadoDefinicionFilter.idEstadoPagoContadoDefinicion === 0 &&
			pagoContadoDefinicionFilter.descripcion.length === 0) {
			data = await PagoContadoDefinicionModel.findAll();
		}
		else {
			data = await PagoContadoDefinicionModel.findAll({ where: filters });
		}
		//filtro de fechas
		if (pagoContadoDefinicionFilter.fechaDesde !== null) {
			data = data.filter(f => isNull(f.fechaHasta) || f.fechaHasta.getTime() >= pagoContadoDefinicionFilter.fechaDesde.getTime());
		}
		if (pagoContadoDefinicionFilter.fechaHasta !== null) {
			data = data.filter(f => isNull(f.fechaDesde) || f.fechaDesde.getTime() <= pagoContadoDefinicionFilter.fechaHasta.getTime());
		}

		const result = data.map((row) => new PagoContadoDefinicion(...row.getDataValues()));

        return result;
    }

	async findById(id:number) {
		const data = await PagoContadoDefinicionModel.findOne({
			include: [
				{ model: TipoPlanPagoModel, as: 'tipoPlanPago' }
            ],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:PagoContadoDefinicion) {
		const data = await PagoContadoDefinicionModel.create({
			idEstadoPagoContadoDefinicion: row.idEstadoPagoContadoDefinicion,
			idTipoPlanPago: row.idTipoPlanPago,
			idTipoTributo: row.idTipoTributo,
			idTasaPagoContado: row.idTasaPagoContado,
			idSubTasaPagoContado: row.idSubTasaPagoContado,
			idTasaSellados: row.idTasaSellados,
			idSubTasaSellados: row.idSubTasaSellados,
			idTasaGastosCausidicos: row.idTasaGastosCausidicos,
			idSubTasaGastosCausidicos: row.idSubTasaGastosCausidicos,
			codigo: row.codigo,
			descripcion: row.descripcion,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			idTipoAlcanceTemporal: row.idTipoAlcanceTemporal,
			fechaDesdeAlcanceTemporal: row.fechaDesdeAlcanceTemporal,
			fechaHastaAlcanceTemporal: row.fechaHastaAlcanceTemporal,
			mesDesdeAlcanceTemporal: row.mesDesdeAlcanceTemporal,
			mesHastaAlcanceTemporal: row.mesHastaAlcanceTemporal,
			aplicaDerechosEspontaneos: row.aplicaDerechosEspontaneos,
			aplicaTotalidadDeudaAdministrativa: row.aplicaTotalidadDeudaAdministrativa,
			aplicaDeudaAdministrativa: row.aplicaDeudaAdministrativa,
			aplicaDeudaLegal: row.aplicaDeudaLegal,
			aplicaGranContribuyente: row.aplicaGranContribuyente,
			aplicaPequenioContribuyente: row.aplicaPequenioContribuyente,
			montoDeudaAdministrativaDesde: row.montoDeudaAdministrativaDesde,
			montoDeudaAdministrativaHasta: row.montoDeudaAdministrativaHasta,
			idViaConsolidacion: row.idViaConsolidacion,
			porcentajeQuitaRecargos: row.porcentajeQuitaRecargos,
			porcentajeQuitaMultaInfracciones: row.porcentajeQuitaMultaInfracciones,
			porcentajeQuitaHonorarios: row.porcentajeQuitaHonorarios,
			porcentajeQuitaAportes: row.porcentajeQuitaAportes,
			idUsuarioCreacion: row.idUsuarioCreacion,
			fechaCreacion: row.fechaCreacion
		});
		const result = new PagoContadoDefinicion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoContadoDefinicion) {
		const affectedCount = await PagoContadoDefinicionModel.update({
			idEstadoPagoContadoDefinicion: row.idEstadoPagoContadoDefinicion,
			idTipoPlanPago: row.idTipoPlanPago,
			idTipoTributo: row.idTipoTributo,
			idTasaPagoContado: row.idTasaPagoContado,
			idSubTasaPagoContado: row.idSubTasaPagoContado,
			idTasaSellados: row.idTasaSellados,
			idSubTasaSellados: row.idSubTasaSellados,
			idTasaGastosCausidicos: row.idTasaGastosCausidicos,
			idSubTasaGastosCausidicos: row.idSubTasaGastosCausidicos,
			codigo: row.codigo,
			descripcion: row.descripcion,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			idTipoAlcanceTemporal: row.idTipoAlcanceTemporal,
			fechaDesdeAlcanceTemporal: row.fechaDesdeAlcanceTemporal,
			fechaHastaAlcanceTemporal: row.fechaHastaAlcanceTemporal,
			mesDesdeAlcanceTemporal: row.mesDesdeAlcanceTemporal,
			mesHastaAlcanceTemporal: row.mesHastaAlcanceTemporal,
			aplicaDerechosEspontaneos: row.aplicaDerechosEspontaneos,
			aplicaTotalidadDeudaAdministrativa: row.aplicaTotalidadDeudaAdministrativa,
			aplicaDeudaAdministrativa: row.aplicaDeudaAdministrativa,
			aplicaDeudaLegal: row.aplicaDeudaLegal,
			aplicaGranContribuyente: row.aplicaGranContribuyente,
			aplicaPequenioContribuyente: row.aplicaPequenioContribuyente,
			montoDeudaAdministrativaDesde: row.montoDeudaAdministrativaDesde,
			montoDeudaAdministrativaHasta: row.montoDeudaAdministrativaHasta,
			idViaConsolidacion: row.idViaConsolidacion,
			porcentajeQuitaRecargos: row.porcentajeQuitaRecargos,
			porcentajeQuitaMultaInfracciones: row.porcentajeQuitaMultaInfracciones,
			porcentajeQuitaHonorarios: row.porcentajeQuitaHonorarios,
			porcentajeQuitaAportes: row.porcentajeQuitaAportes
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoContadoDefinicionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoContadoDefinicion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoContadoDefinicionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await PagoContadoDefinicionModel.sequelize.transaction(async (t) => {
			return request();
		});
	}


	ObjectToClass(row:any) {
		const tipoPlanPago = row["tipoPlanPago"];

		let pagoContadoDefinicion = new PagoContadoDefinicion(...row.getDataValues());
		if (tipoPlanPago){
			pagoContadoDefinicion.tipoPlanPago = new TipoPlanPago(...tipoPlanPago.getDataValues());
		}

		return pagoContadoDefinicion;
	}
}
