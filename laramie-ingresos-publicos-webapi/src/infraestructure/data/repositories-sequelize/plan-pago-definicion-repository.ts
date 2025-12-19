import { Sequelize, Op } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IPlanPagoDefinicionRepository from '../../../domain/repositories/plan-pago-definicion-repository';
import PlanPagoDefinicionModel from './models/plan-pago-definicion-model';
import PlanPagoDefinicion from '../../../domain/entities/plan-pago-definicion';
import TipoPlanPagoModel from './models/tipo-plan-pago-model';
import TipoPlanPago from '../../../domain/entities/tipo-plan-pago';
import PlanPagoDefinicionFilter from '../../../domain/dto/plan-pago-definicion-filter';
import { isNull } from '../../sdk/utils/validator';

export default class PlanPagoDefinicionRepositorySequelize implements IPlanPagoDefinicionRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionModel.findAll({
			include: [
				{ model: TipoPlanPagoModel, as: 'tipoPlanPago' }
            ]
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async listByFilter(planPagoDefinicionFilter: PlanPagoDefinicionFilter) {

		let filters = {};
		if (planPagoDefinicionFilter.idEstadoPlanPagoDefinicion > 0) filters["idEstadoPlanPagoDefinicion"] = planPagoDefinicionFilter.idEstadoPlanPagoDefinicion;
		if (planPagoDefinicionFilter.idTipoPlanPago > 0) filters["idTipoPlanPago"] = planPagoDefinicionFilter.idTipoPlanPago;
		if (planPagoDefinicionFilter.idTipoTributo > 0) filters["idTipoTributo"] = planPagoDefinicionFilter.idTipoTributo;
		if (planPagoDefinicionFilter.idTasaPlanPago > 0) filters["idTasaPlanPago"] = planPagoDefinicionFilter.idTasaPlanPago;
		if (planPagoDefinicionFilter.idSubTasaPlanPago > 0) filters["idSubTasaPlanPago"] = planPagoDefinicionFilter.idSubTasaPlanPago;
		if (planPagoDefinicionFilter.descripcion.length > 0) {
			filters["descripcion"] = {
				[Op.iLike]: `%${planPagoDefinicionFilter.descripcion}%`
			};
		}

		let data = null;
		if (planPagoDefinicionFilter.idEstadoPlanPagoDefinicion === 0 &&
			planPagoDefinicionFilter.idTipoPlanPago === 0 &&
			planPagoDefinicionFilter.idTipoTributo === 0 &&
			planPagoDefinicionFilter.idTasaPlanPago === 0 &&
			planPagoDefinicionFilter.idSubTasaPlanPago === 0 &&
			planPagoDefinicionFilter.descripcion.length === 0) {
			data = await PlanPagoDefinicionModel.findAll();
		}
		else {
			data = await PlanPagoDefinicionModel.findAll({ where: filters });
		}
		//filtro de fechas
		if (planPagoDefinicionFilter.fechaDesde !== null) {
			data = data.filter(f => isNull(f.fechaHasta) || f.fechaHasta.getTime() >= planPagoDefinicionFilter.fechaDesde.getTime());
		}
		if (planPagoDefinicionFilter.fechaHasta !== null) {
			data = data.filter(f => isNull(f.fechaDesde) || f.fechaDesde.getTime() <= planPagoDefinicionFilter.fechaHasta.getTime());
		}

		const result = data.map((row) => new PlanPagoDefinicion(...row.getDataValues()));

        return result;
    }

	async findById(id:number) {
		const data = await PlanPagoDefinicionModel.findOne({
			include: [
				{ model: TipoPlanPagoModel, as: 'tipoPlanPago' }
            ],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:PlanPagoDefinicion) {
		const data = await PlanPagoDefinicionModel.create({
			idEstadoPlanPagoDefinicion: row.idEstadoPlanPagoDefinicion,
			idTipoPlanPago: row.idTipoPlanPago,
			idTipoTributo: row.idTipoTributo,
			idTasaPlanPago: row.idTasaPlanPago,
			idSubTasaPlanPago: row.idSubTasaPlanPago,
			idTasaInteres: row.idTasaInteres,
			idSubTasaInteres: row.idSubTasaInteres,
			idTasaSellados: row.idTasaSellados,
			idSubTasaSellados: row.idSubTasaSellados,
			idTasaGastosCausidicos: row.idTasaGastosCausidicos,
			idSubTasaGastosCausidicos: row.idSubTasaGastosCausidicos,
			codigo: row.codigo,
			descripcion: row.descripcion,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			tieneAnticipo: row.tieneAnticipo,
			cuotaDesde: row.cuotaDesde,
			cuotaHasta: row.cuotaHasta,
			peridiocidad: row.peridiocidad,
			idTipoVencimientoAnticipo: row.idTipoVencimientoAnticipo,
			idTipoVencimientoCuota1: row.idTipoVencimientoCuota1,
			idTipoVencimientoCuotas: row.idTipoVencimientoCuotas,
			porcentajeAnticipo: row.porcentajeAnticipo,
			idTipoAlcanceTemporal: row.idTipoAlcanceTemporal,
			fechaDesdeAlcanceTemporal: row.fechaDesdeAlcanceTemporal,
			fechaHastaAlcanceTemporal: row.fechaHastaAlcanceTemporal,
			mesDesdeAlcanceTemporal: row.mesDesdeAlcanceTemporal,
			mesHastaAlcanceTemporal: row.mesHastaAlcanceTemporal,
			aplicaDerechosEspontaneos: row.aplicaDerechosEspontaneos,
			aplicaCancelacionAnticipada: row.aplicaCancelacionAnticipada,
			aplicaTotalidadDeudaAdministrativa: row.aplicaTotalidadDeudaAdministrativa,
			aplicaDeudaAdministrativa: row.aplicaDeudaAdministrativa,
			aplicaDeudaLegal: row.aplicaDeudaLegal,
			aplicaGranContribuyente: row.aplicaGranContribuyente,
			aplicaPequenioContribuyente: row.aplicaPequenioContribuyente,
			caducidadAnticipoImpago: row.caducidadAnticipoImpago,
			caducidadCantidadCuotasConsecutivas: row.caducidadCantidadCuotasConsecutivas,
			caducidadCantidadCuotasNoConsecutivas: row.caducidadCantidadCuotasNoConsecutivas,
			caducidadCantidadDiasVencimiento: row.caducidadCantidadDiasVencimiento,
			caducidadCantidadDeclaracionesJuradas: row.caducidadCantidadDeclaracionesJuradas,
			montoDeudaAdministrativaDesde: row.montoDeudaAdministrativaDesde,
			montoDeudaAdministrativaHasta: row.montoDeudaAdministrativaHasta,
			montoCuotaDesde: row.montoCuotaDesde,
			montoCuotaHasta: row.montoCuotaHasta,
			idTipoCalculoInteres: row.idTipoCalculoInteres,
			idUsuarioCreacion: row.idUsuarioCreacion,
			fechaCreacion: row.fechaCreacion
		});
		const result = new PlanPagoDefinicion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicion) {
		const affectedCount = await PlanPagoDefinicionModel.update({
			idEstadoPlanPagoDefinicion: row.idEstadoPlanPagoDefinicion,
			idTipoPlanPago: row.idTipoPlanPago,
			idTipoTributo: row.idTipoTributo,
			idTasaPlanPago: row.idTasaPlanPago,
			idSubTasaPlanPago: row.idSubTasaPlanPago,
			idTasaInteres: row.idTasaInteres,
			idSubTasaInteres: row.idSubTasaInteres,
			idTasaSellados: row.idTasaSellados,
			idSubTasaSellados: row.idSubTasaSellados,
			idTasaGastosCausidicos: row.idTasaGastosCausidicos,
			idSubTasaGastosCausidicos: row.idSubTasaGastosCausidicos,
			codigo: row.codigo,
			descripcion: row.descripcion,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			tieneAnticipo: row.tieneAnticipo,
			cuotaDesde: row.cuotaDesde,
			cuotaHasta: row.cuotaHasta,
			peridiocidad: row.peridiocidad,
			idTipoVencimientoAnticipo: row.idTipoVencimientoAnticipo,
			idTipoVencimientoCuota1: row.idTipoVencimientoCuota1,
			idTipoVencimientoCuotas: row.idTipoVencimientoCuotas,
			porcentajeAnticipo: row.porcentajeAnticipo,
			idTipoAlcanceTemporal: row.idTipoAlcanceTemporal,
			fechaDesdeAlcanceTemporal: row.fechaDesdeAlcanceTemporal,
			fechaHastaAlcanceTemporal: row.fechaHastaAlcanceTemporal,
			mesDesdeAlcanceTemporal: row.mesDesdeAlcanceTemporal,
			mesHastaAlcanceTemporal: row.mesHastaAlcanceTemporal,
			aplicaDerechosEspontaneos: row.aplicaDerechosEspontaneos,
			aplicaCancelacionAnticipada: row.aplicaCancelacionAnticipada,
			aplicaTotalidadDeudaAdministrativa: row.aplicaTotalidadDeudaAdministrativa,
			aplicaDeudaAdministrativa: row.aplicaDeudaAdministrativa,
			aplicaDeudaLegal: row.aplicaDeudaLegal,
			aplicaGranContribuyente: row.aplicaGranContribuyente,
			aplicaPequenioContribuyente: row.aplicaPequenioContribuyente,
			caducidadAnticipoImpago: row.caducidadAnticipoImpago,
			caducidadCantidadCuotasConsecutivas: row.caducidadCantidadCuotasConsecutivas,
			caducidadCantidadCuotasNoConsecutivas: row.caducidadCantidadCuotasNoConsecutivas,
			caducidadCantidadDiasVencimiento: row.caducidadCantidadDiasVencimiento,
			caducidadCantidadDeclaracionesJuradas: row.caducidadCantidadDeclaracionesJuradas,
			montoDeudaAdministrativaDesde: row.montoDeudaAdministrativaDesde,
			montoDeudaAdministrativaHasta: row.montoDeudaAdministrativaHasta,
			montoCuotaDesde: row.montoCuotaDesde,
			montoCuotaHasta: row.montoCuotaHasta,
			idTipoCalculoInteres: row.idTipoCalculoInteres
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await PlanPagoDefinicionModel.sequelize.transaction(async (t) => {
			return request();
		});
	}


	ObjectToClass(row:any) {
		const tipoPlanPago = row["tipoPlanPago"];

		let planPagoDefinicion = new PlanPagoDefinicion(...row.getDataValues());
		if (tipoPlanPago){
			planPagoDefinicion.tipoPlanPago = new TipoPlanPago(...tipoPlanPago.getDataValues());
		}

		return planPagoDefinicion;
	}

}
