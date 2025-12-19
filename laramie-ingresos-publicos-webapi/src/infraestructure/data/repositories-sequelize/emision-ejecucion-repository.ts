import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IEmisionEjecucionRepository from '../../../domain/repositories/emision-ejecucion-repository';
import EmisionEjecucionModel from './models/emision-ejecucion-model';
import EmisionEjecucion from '../../../domain/entities/emision-ejecucion';
import EmisionEjecucionFilter from '../../../domain/dto/emision-ejecucion-filter';
import EmisionEjecucionRow from '../../../domain/dto/emision-ejecucion-row';

export default class EmisionEjecucionRepositorySequelize implements IEmisionEjecucionRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionEjecucionModel.findAll();
		const result = data.map((row) => new EmisionEjecucion(...row.getDataValues()));

		return result;
	}

	async listByFilter(emisionEjecucionnFilter: EmisionEjecucionFilter) {
        const cursor = await EmisionEjecucionModel.sequelize.query(
            `SELECT * FROM emision_ejecucion_lista(:p_id_emision_definicion,:p_id_tipo_tributo,:p_numero,:p_descripcion,:p_periodo,:p_etiqueta,:p_calculo_masivo,:p_calculo_mostrador_web);`,
            {
                replacements: {
					p_id_emision_definicion: emisionEjecucionnFilter.idEmisionDefinicion,
                    p_id_tipo_tributo: emisionEjecucionnFilter.idTipoTributo,
                    p_numero: emisionEjecucionnFilter.numero,
                    p_descripcion: emisionEjecucionnFilter.descripcion,
                    p_periodo: emisionEjecucionnFilter.periodo,
					p_etiqueta: emisionEjecucionnFilter.etiqueta,
					p_calculo_masivo: emisionEjecucionnFilter.calculoMasivo,
					p_calculo_mostrador_web: emisionEjecucionnFilter.calculoMostradorWeb
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new EmisionEjecucionRow();
            item.id = row.id;
			item.idEmisionDefinicion = row.id_emision_definicion;
			item.periodo = row.periodo;
			item.numeroEmisionEjecucion = row.numero_emision_ejecucion;
			item.descripcionEmisionEjecucion = row.descripcion_emision_ejecucion;
			item.estadoEmisionEjecucion = row.estado_emision_ejecucion;
			item.numeroEmisionDefinicion = row.numero_emision_definicion;
			item.descripcionEmisionDefinicion = row.descripcion_emision_definicion;
			item.estadoEmisionDefinicion = row.estado_emision_definicion;
            item.tipoTributo = row.tipo_tributo;
            item.numeracion = row.numeracion;
            
            return item;
        });

        return result;
	}

	async listByEmisionDefinicion(idEmisionDefinicion:number) {
		const data = await EmisionEjecucionModel.findAll({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = data.map((row) => new EmisionEjecucion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionEjecucionModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionEjecucion(...data.getDataValues()) : null;

		return result;
	}

	async findByNumero(numero:string, calculoMasivo:boolean) {
		const data = await EmisionEjecucionModel.findOne({ where: { numero: numero, calculoMasivo: calculoMasivo } });
		const result = (data) ? new EmisionEjecucion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionEjecucion) {
		const data = await EmisionEjecucionModel.create({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idEstadoEmisionEjecucion: row.idEstadoEmisionEjecucion,
			numero: row.numero,
			descripcion: row.descripcion,
			descripcionAbreviada: row.descripcionAbreviada,
			periodo: row.periodo,
			imprimeRecibosEmision: row.imprimeRecibosEmision,
			aplicaDebitoAutomatico: row.aplicaDebitoAutomatico,
			calculoMostradorWeb: row.calculoMostradorWeb,
			calculoMasivo: row.calculoMasivo,
			calculoPrueba: row.calculoPrueba,
			calculoPagoAnticipado: row.calculoPagoAnticipado,
			fechaPagoAnticipadoVencimiento1: row.fechaPagoAnticipadoVencimiento1,
			fechaPagoAnticipadoVencimiento2: row.fechaPagoAnticipadoVencimiento2,
			fechaEjecucionInicio: row.fechaEjecucionInicio,
			fechaEjecucionFin: row.fechaEjecucionFin
		});
		const result = new EmisionEjecucion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionEjecucion) {
		const affectedCount = await EmisionEjecucionModel.update({
			idEstadoEmisionEjecucion: row.idEstadoEmisionEjecucion,
			numero: row.numero,
			descripcion: row.descripcion,
			descripcionAbreviada: row.descripcionAbreviada,
			imprimeRecibosEmision: row.imprimeRecibosEmision,
			aplicaDebitoAutomatico: row.aplicaDebitoAutomatico,
			calculoPrueba: row.calculoPrueba,
			calculoPagoAnticipado: row.calculoPagoAnticipado,
			fechaPagoAnticipadoVencimiento1: row.fechaPagoAnticipadoVencimiento1,
			fechaPagoAnticipadoVencimiento2: row.fechaPagoAnticipadoVencimiento2,
			fechaEjecucionInicio: row.fechaEjecucionInicio,
			fechaEjecucionFin: row.fechaEjecucionFin
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionEjecucionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionEjecucion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionEjecucionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await EmisionEjecucionModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
