import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IEmisionDefinicionRepository from '../../../domain/repositories/emision-definicion-repository';
import EmisionDefinicionModel from './models/emision-definicion-model';
import EmisionDefinicion from '../../../domain/entities/emision-definicion';
import EmisionDefinicionFilter from '../../../domain/dto/emision-definicion-filter';
import EmisionDefinicionRow from '../../../domain/dto/emision-definicion-row';

export default class EmisionDefinicionRepositorySequelize implements IEmisionDefinicionRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionDefinicionModel.findAll();
		const result = data.map((row) => new EmisionDefinicion(...row.getDataValues()));

		return result;
	}

	async listByFilter(emisionDefinicionFilter: EmisionDefinicionFilter) {
        const cursor = await EmisionDefinicionModel.sequelize.query(
            `SELECT * FROM emision_definicion_lista(:p_id_tipo_tributo,:p_numero,:p_descripcion,:p_etiqueta);`,
            {
                replacements: {
                    p_id_tipo_tributo: emisionDefinicionFilter.idTipoTributo,
                    p_numero: emisionDefinicionFilter.numero,
                    p_descripcion: emisionDefinicionFilter.descripcion,
                    p_etiqueta: emisionDefinicionFilter.etiqueta
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new EmisionDefinicionRow();
            item.id = row.id;
            item.numero = row.numero;
            item.descripcion = row.descripcion;
            item.estadoEmisionDefinicion = row.estado_emision_definicion;
            item.tipoTributo = row.tipo_tributo;
            item.numeracion = row.numeracion;
            
            return item;
        });

        return result;
	}

	async findById(id:number) {
		const data = await EmisionDefinicionModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionDefinicion(...data.getDataValues()) : null;

		return result;
	}

	async findByNumero(numero:string) {
		const data = await EmisionDefinicionModel.findOne({ where: { numero: numero } });
		const result = (data) ? new EmisionDefinicion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionDefinicion) {
		const data = await EmisionDefinicionModel.create({
			idTipoTributo: row.idTipoTributo,
			idNumeracion: row.idNumeracion,
			idProcedimiento: row.idProcedimiento,
			idEstadoEmisionDefinicion: row.idEstadoEmisionDefinicion,
			idEmisionDefinicionBase: row.idEmisionDefinicionBase,
			numero: row.numero,
			descripcion: row.descripcion,
			codigoDelegacion: row.codigoDelegacion,
			periodo: row.periodo,
			procesaPlanes: row.procesaPlanes,
			procesaRubros: row.procesaRubros,
			procesaElementos: row.procesaElementos,
			calculoMostradorWeb: row.calculoMostradorWeb,
			calculoMasivo: row.calculoMasivo,
			calculoPagoAnticipado: row.calculoPagoAnticipado,
			fechaReliquidacionDesde: row.fechaReliquidacionDesde,
			fechaReliquidacionHasta: row.fechaReliquidacionHasta,
			modulo: row.modulo
		});
		const result = new EmisionDefinicion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionDefinicion) {
		const affectedCount = await EmisionDefinicionModel.update({
			idTipoTributo: row.idTipoTributo,
			idNumeracion: row.idNumeracion,
			idProcedimiento: row.idProcedimiento,
			idEstadoEmisionDefinicion: row.idEstadoEmisionDefinicion,
			idEmisionDefinicionBase: row.idEmisionDefinicionBase,
			numero: row.numero,
			descripcion: row.descripcion,
			codigoDelegacion: row.codigoDelegacion,
			periodo: row.periodo,
			procesaPlanes: row.procesaPlanes,
			procesaRubros: row.procesaRubros,
			procesaElementos: row.procesaElementos,
			calculoMostradorWeb: row.calculoMostradorWeb,
			calculoMasivo: row.calculoMasivo,
			calculoPagoAnticipado: row.calculoPagoAnticipado,
			fechaReliquidacionDesde: row.fechaReliquidacionDesde,
			fechaReliquidacionHasta: row.fechaReliquidacionHasta,
			modulo: row.modulo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionDefinicionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionDefinicion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionDefinicionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await EmisionDefinicionModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
