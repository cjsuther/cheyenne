import IEdesurRepository from '../../../domain/repositories/edesur-repository';
import EdesurModel from './models/edesur-model';
import Edesur from '../../../domain/entities/edesur';
import EdesurState from '../../../domain/dto/edesur-state';
import EdesurClienteModel from './models/edesur-cliente-model';
import EdesurClienteState from '../../../domain/dto/edesur-cliente-state';
import PersonaModel from './models/persona-model';

export default class EdesurRepositorySequelize implements IEdesurRepository {

	constructor() {
	}

	async listByInmueble(idInmueble: number) {
		const data = await EdesurModel.findAll({
            include: [
				{
					model: EdesurClienteModel,
					as: 'edesurCliente',
					include: [
						{ model: PersonaModel, as: 'persona' }
					]
				}
            ],
			where: { idInmueble: idInmueble }
		});
		const result = data.map((row) => {
			const edesurClientes = row["edesurCliente"];

			let edesur = new EdesurState(...row.getDataValues());
			edesur.edesurClientes = (edesurClientes.map((cliente) => this.ObjectToClass_EdesurCliente(cliente)) as Array<EdesurClienteState>).sort((a, b) => a.id - b.id);

			return edesur;
		});

		return result;
	}

	async findById(id:number) {
		const data = await EdesurModel.findOne({ where: { id: id } });
		const result = (data) ? new Edesur(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Edesur) {
		const data = await EdesurModel.create({
			idInmueble: row.idInmueble,
			ultPeriodoEdesur: row.ultPeriodoEdesur,
			ultCuotaEdesur: row.ultCuotaEdesur,
			ultImporteEdesur: row.ultImporteEdesur,
			medidor: row.medidor,
			idFrecuenciaFacturacion: row.idFrecuenciaFacturacion,
			plan: row.plan,
			radio: row.radio,
			manzana: row.manzana,
			idAnteriorEdesur: row.idAnteriorEdesur,
			tarifa: row.tarifa,
			tarifa1: row.tarifa1,
			claseServicio: row.claseServicio,
			porcDesc: row.porcDesc,
			cAnual: row.cAnual,
			recorrido: row.recorrido,
			planB: row.planB,
			lzEdesur: row.lzEdesur,
			facturarABL: row.facturarABL,
			facturar: row.facturar,
			facturarEdesur: row.facturarEdesur,
			comuna: row.comuna,
			calleEdesur: row.calleEdesur,
			numeroEdesur: row.numeroEdesur
		});
		const result = new Edesur(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Edesur) {
		const affectedCount = await EdesurModel.update({
			idInmueble: row.idInmueble,
			ultPeriodoEdesur: row.ultPeriodoEdesur,
			ultCuotaEdesur: row.ultCuotaEdesur,
			ultImporteEdesur: row.ultImporteEdesur,
			medidor: row.medidor,
			idFrecuenciaFacturacion: row.idFrecuenciaFacturacion,
			plan: row.plan,
			radio: row.radio,
			manzana: row.manzana,
			idAnteriorEdesur: row.idAnteriorEdesur,
			tarifa: row.tarifa,
			tarifa1: row.tarifa1,
			claseServicio: row.claseServicio,
			porcDesc: row.porcDesc,
			cAnual: row.cAnual,
			recorrido: row.recorrido,
			planB: row.planB,
			lzEdesur: row.lzEdesur,
			facturarABL: row.facturarABL,
			facturar: row.facturar,
			facturarEdesur: row.facturarEdesur,
			comuna: row.comuna,
			calleEdesur: row.calleEdesur,
			numeroEdesur: row.numeroEdesur
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EdesurModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Edesur(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EdesurModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	ObjectToClass_EdesurCliente(row:any) {
		const persona = row["persona"];

		let edesurCliente = new EdesurClienteState(...row.getDataValues());
		if (persona) {
			edesurCliente.idTipoPersona = parseInt(persona.idTipoPersona);
			edesurCliente.nombrePersona = persona.nombrePersona;
			edesurCliente.idTipoDocumento = parseInt(persona.idTipoDocumento);
			edesurCliente.numeroDocumento = persona.numeroDocumento;
		}

		return edesurCliente;
	}

}