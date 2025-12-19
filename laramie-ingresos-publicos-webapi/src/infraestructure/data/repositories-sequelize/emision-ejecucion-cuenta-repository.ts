import IEmisionEjecucionCuentaRepository from '../../../domain/repositories/emision-ejecucion-cuenta-repository';
import EmisionEjecucionCuentaModel from './models/emision-ejecucion-cuenta-model';
import EmisionEjecucionCuenta from '../../../domain/entities/emision-ejecucion-cuenta';
import EmisionEjecucionCuentaResume from '../../../domain/dto/emision-ejecucion-cuenta-resume';
import EmisionCalculoResultadoRepositorySequelize from './emision-calculo-resultado-repository';
import EmisionCalculoResultado from '../../../domain/entities/emision-calculo-resultado';
import EmisionConceptoResultadoRepositorySequelize from './emision-concepto-resultado-repository';
import EmisionConceptoResultado from '../../../domain/entities/emision-concepto-resultado';
import EmisionCuentaCorrienteResultadoRepositorySequelize from './emision-cuenta-corriente-resultado-repository';
import EmisionCuentaCorrienteResultado from '../../../domain/entities/emision-cuenta-corriente-resultado';
import EmisionImputacionContableResultadoRepositorySequelize from './emision-imputacion-contable-resultado-repository';
import EmisionImputacionContableResultado from '../../../domain/entities/emision-imputacion-contable-resultado';
import EmisionEjecucionCuotaRepositorySequelize from './emision-ejecucion-cuota-repository';
import EmisionEjecucionCuotaModel from './models/emision-ejecucion-cuota-model';
import EmisionEjecucionCuota from '../../../domain/entities/emision-ejecucion-cuota';
import EmisionEjecucionCuentaPublicacion from '../../../domain/dto/emision-ejecucion-cuenta-publicacion';

export default class EmisionEjecucionCuentaRepositorySequelize implements IEmisionEjecucionCuentaRepository {

	constructor() {

	}

	async listResume(idEmisionEjecucion:number) {
        const cursor = await EmisionEjecucionCuentaModel.sequelize.query(
            `SELECT * FROM emision_ejecucion_cuenta_lista_resumen(:p_id_emision_ejecucion);`,
            {
                replacements: {
                    p_id_emision_ejecucion: idEmisionEjecucion
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new EmisionEjecucionCuentaResume();
            item.idEmisionEjecucion = row.id_emision_ejecucion;
            item.idEstadoEmisionEjecucion = row.id_estado_emision_ejecucion;
            item.fechaEjecucionInicio = row.fecha_ejecucion_inicio;
            item.fechaEjecucionFin = row.fecha_ejecucion_fin;
            item.idEstadoEmisionEjecucionCuenta = row.id_estado_emision_ejecucion_cuenta;
            item.estadoEmisionEjecucionCuenta = row.estado_emision_ejecucion_cuenta;
            item.cantidad = row.cantidad;
            
            return item;
        });

        return result;
    }

	async listPublicacion(idEmisionEjecucion:number) {
        const cursor = await EmisionEjecucionCuentaModel.sequelize.query(
            `SELECT * FROM emision_ejecucion_cuenta_lista_publicacion(:p_id_emision_ejecucion);`,
            {
                replacements: {
                    p_id_emision_ejecucion: idEmisionEjecucion
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new EmisionEjecucionCuentaPublicacion();
			item.idEmisionEjecucion = row.id_emision_ejecucion;
			item.idEmisionDefinicion = row.id_emision_definicion;
			item.numeroEjecucion = row.numero_ejecucion;
			item.descripcionEjecucion = row.descripcion_ejecucion;
			item.descripcionAbreviada = row.descripcion_abreviada;
			item.calculoPagoAnticipado = row.calculo_pago_anticipado;
			item.aplicaDebitoAutomatico = row.aplica_debito_automatico;
			item.idCuenta = row.id_cuenta;
			item.idTipoTributo = row.id_tipo_tributo;
			item.numeroCuenta = row.numero_cuenta;
			item.periodo = row.periodo;
			item.cuota = row.cuota;
			item.codigoDelegacion = row.codigo_delegacion;
			item.numeroRecibo = row.numero_recibo;
			item.codigoBarras = row.codigo_barras;
			item.importeVencimiento1 = parseFloat(row.importe_vencimiento1);
			item.importeVencimiento2 = parseFloat(row.importe_vencimiento2);
			item.fechaVencimiento1 = row.fecha_vencimiento1;
			item.fechaVencimiento2 = row.fecha_vencimiento2;
			item.idTasa = row.id_tasa;
			item.idSubTasa = row.id_sub_tasa;
			item.idMedioPago = row.id_medio_pago;
			item.detalleMedioPago = row.detalle_medio_pago;
            
            return item;
        });

        return result;
    }

	async list() {
		const data = await EmisionEjecucionCuentaModel.findAll();
		const result = data.map((row) => new EmisionEjecucionCuenta(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucion(idEmisionEjecucion:number) {
		const data = await EmisionEjecucionCuentaModel.findAll({
			include: [
				{ model: EmisionEjecucionCuotaModel, as: 'emisionEjecucionCuota' }
            ],
			where: { idEmisionEjecucion: idEmisionEjecucion }
		});
		const result = data.map((row) => {
			const emisionEjecucionCuota = row["emisionEjecucionCuota"];
			let emisionEjecucionCuenta = new EmisionEjecucionCuenta(...row.getDataValues());
			emisionEjecucionCuenta.emisionEjecucionCuotas = (emisionEjecucionCuota.map((detalle) => new EmisionEjecucionCuota(...detalle.getDataValues())) as Array<EmisionEjecucionCuota>).sort((a, b) => a.id - b.id);
			return emisionEjecucionCuenta;
		});

		return result;
	}

	async findById(id:number) {
		return this.findOne({ id: id });
	}

	async findByNumero(idEmisionEjecucion:number, numero:number) {
		let result = await this.findOne({ idEmisionEjecucion: idEmisionEjecucion, numero: numero });
		if (!result) {
			result = await this.findOne({ idEmisionEjecucion: idEmisionEjecucion });
		}
		return result;
	}

	async findByCuenta(idEmisionEjecucion:number, idCuenta:number) {
		return this.findOne({ idEmisionEjecucion: idEmisionEjecucion, idCuenta: idCuenta });
	}

	async findOne(where:any) {
		const data = await EmisionEjecucionCuentaModel.findOne({ where: where });

		let result = null;
		if (data) {
			const emisionEjecucionCuotaRepository = new EmisionEjecucionCuotaRepositorySequelize();
			const emisionCalculoResultadoRepository = new EmisionCalculoResultadoRepositorySequelize();
			const emisionConceptoResultadoRepository = new EmisionConceptoResultadoRepositorySequelize();
			const emisionCuentaCorrienteResultadoRepository = new EmisionCuentaCorrienteResultadoRepositorySequelize();
			const emisionImputacionContableResultadoRepository = new EmisionImputacionContableResultadoRepositorySequelize();

			let emisionEjecucionCuenta = new EmisionEjecucionCuenta(...data.getDataValues());

			emisionEjecucionCuenta.emisionEjecucionCuotas = await emisionEjecucionCuotaRepository.listByEmisionEjecucionCuenta(emisionEjecucionCuenta.id);
			emisionEjecucionCuenta.emisionCalculosResultado = await emisionCalculoResultadoRepository.listByEmisionEjecucionCuenta(emisionEjecucionCuenta.id);
			emisionEjecucionCuenta.emisionConceptosResultado = await emisionConceptoResultadoRepository.listByEmisionEjecucionCuenta(emisionEjecucionCuenta.id);
			emisionEjecucionCuenta.emisionCuentasCorrientesResultado = await emisionCuentaCorrienteResultadoRepository.listByEmisionEjecucionCuenta(emisionEjecucionCuenta.id);
			emisionEjecucionCuenta.emisionImputacionesContablesResultado = await emisionImputacionContableResultadoRepository.listByEmisionEjecucionCuenta(emisionEjecucionCuenta.id);

			result = emisionEjecucionCuenta;
		}

		return result;
	}

	async add(row:EmisionEjecucionCuenta) {
		const data = await EmisionEjecucionCuentaModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idCuenta: row.idCuenta,
			idEstadoEmisionEjecucionCuenta: row.idEstadoEmisionEjecucionCuenta,
			numero: row.numero,
			numeroBloque: row.numeroBloque,
			observacion: row.observacion
		});
		const result = new EmisionEjecucionCuenta(...data.getDataValues());

		return result;
	}

	async addByBloque(numeroBloque:number, rows:Array<EmisionEjecucionCuenta>) {

		const bulkRows = rows.map((row: EmisionEjecucionCuenta) => {
            return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idCuenta: row.idCuenta,
				idEstadoEmisionEjecucionCuenta: row.idEstadoEmisionEjecucionCuenta,
				numero: row.numero,
				numeroBloque: row.numeroBloque,
				observacion: row.observacion
			}
		});

		const affectedCount = await EmisionEjecucionCuentaModel.bulkCreate(bulkRows);
        const result = (affectedCount != null) ? {affectedCount: affectedCount} : null;
        return result;
	}

	async modify(id:number, row:EmisionEjecucionCuenta) {
		const affectedCount = await EmisionEjecucionCuentaModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idCuenta: row.idCuenta,
			idEstadoEmisionEjecucionCuenta: row.idEstadoEmisionEjecucionCuenta,
			numero: row.numero,
			numeroBloque: row.numeroBloque,
			observacion: row.observacion
		},
		{ where: { id: id } });

		// No se consulta el registro para optimizar timepos de respuesta
		// const data = (affectedCount[0] > 0) ? await EmisionEjecucionCuentaModel.findOne({ where: { id: id } }) : null;
		// const result = (data) ? new EmisionEjecucionCuenta(...data.getDataValues()) : null;
		const result = (affectedCount[0] > 0) ? row : null;

		return result;
	}

	async modifyByEmisionEjecucion(updates:Array<any>) {
		let requests = [];
		for(let i=0; i < updates.length; i++) {
			const update = updates[i];
			requests.push(EmisionEjecucionCuentaModel.update(
				{ numero: update.numero },
				{ where: { id: update.idEmisionEjecucionCuenta } })
			);
		}

		const result = await Promise.all(requests);
		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionEjecucionCuentaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionEjecucion(idEmisionEjecucion:number) {
		const affectedCount = await EmisionEjecucionCuentaModel.destroy({ where: { idEmisionEjecucion: idEmisionEjecucion } });
		const result = (affectedCount > 0) ? {idEmisionEjecucion} : null;
		
		return result;
	}

}
