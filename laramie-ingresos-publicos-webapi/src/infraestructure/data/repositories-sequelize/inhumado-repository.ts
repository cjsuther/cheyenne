import IInhumadoRepository from '../../../domain/repositories/inhumado-repository';
import InhumadoModel from './models/inhumado-model';
import Inhumado from '../../../domain/entities/inhumado';
import InhumadoState from '../../../domain/dto/inhumado-state';
import DireccionModel from './models/direccion-model';
import Direccion from '../../../domain/entities/direccion';
import VerificacionModel from './models/verificacion-model';
import VerificacionState from '../../../domain/dto/verificacion-state';


export default class InhumadoRepositorySequelize implements IInhumadoRepository {

	constructor() {

	}

	async listByCementerio(idCementerio: number) {
		const data = await InhumadoModel.findAll({
            include: [
				{ model: DireccionModel, as: 'direccion' },
				{ model: VerificacionModel, as: 'verificacion' }
            ],
			where: { idCementerio: idCementerio }
		});
		const result = data.map((row) => {
			const direccion = row["direccion"];
			const verificacion = row["verificacion"];

			let inhumado = new InhumadoState(...row.getDataValues());
			inhumado.direccion = new Direccion(...direccion[0].getDataValues());
			inhumado.verificaciones = (verificacion.map((detalle) => new VerificacionState(...detalle.getDataValues())) as Array<VerificacionState>).sort((a, b) => a.id - b.id);

			return inhumado;
		});

		return result;
	}

	async findById(id:number) {
		const data = await InhumadoModel.findOne({ where: { id: id } });
		const result = (data) ? new Inhumado(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Inhumado) {
		const data = await InhumadoModel.create({
			idCementerio: row.idCementerio,
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento,
			apellido: row.apellido,
			nombre: row.nombre,
			fechaNacimiento: row.fechaNacimiento,
			idGenero: row.idGenero,
			idEstadoCivil: row.idEstadoCivil,
			idNacionalidad: row.idNacionalidad,
			fechaDefuncion: row.fechaDefuncion,
			fechaIngreso: row.fechaIngreso,
			idMotivoFallecimiento: row.idMotivoFallecimiento,
			idCocheria: row.idCocheria,
			numeroDefuncion: row.numeroDefuncion,
			libro: row.libro,
			folio: row.folio,
			idRegistroCivil: row.idRegistroCivil,
			acta: row.acta,
			idTipoOrigenInhumacion: row.idTipoOrigenInhumacion,
			observacionesOrigen: row.observacionesOrigen,
			idTipoCondicionEspecial: row.idTipoCondicionEspecial,
			fechaEgreso: row.fechaEgreso,
			fechaTraslado: row.fechaTraslado,
			idTipoDestinoInhumacion: row.idTipoDestinoInhumacion,
			observacionesDestino: row.observacionesDestino,
			fechaExhumacion: row.fechaExhumacion,
			fechaReduccion: row.fechaReduccion,
			numeroReduccion: row.numeroReduccion,
			unidad: row.unidad,
			idTipoDocumentoResponsable: row.idTipoDocumentoResponsable,
			numeroDocumentoResponsable: row.numeroDocumentoResponsable,
			apellidoResponsable: row.apellidoResponsable,
			nombreResponsable: row.nombreResponsable,
			fechaHoraInicioVelatorio: row.fechaHoraInicioVelatorio,
			fechaHoraFinVelatorio: row.fechaHoraFinVelatorio
		});
		const result = new Inhumado(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Inhumado) {
		const affectedCount = await InhumadoModel.update({
			idCementerio: row.idCementerio,
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento,
			apellido: row.apellido,
			nombre: row.nombre,
			fechaNacimiento: row.fechaNacimiento,
			idGenero: row.idGenero,
			idEstadoCivil: row.idEstadoCivil,
			idNacionalidad: row.idNacionalidad,
			fechaDefuncion: row.fechaDefuncion,
			fechaIngreso: row.fechaIngreso,
			idMotivoFallecimiento: row.idMotivoFallecimiento,
			idCocheria: row.idCocheria,
			numeroDefuncion: row.numeroDefuncion,
			libro: row.libro,
			folio: row.folio,
			idRegistroCivil: row.idRegistroCivil,
			acta: row.acta,
			idTipoOrigenInhumacion: row.idTipoOrigenInhumacion,
			observacionesOrigen: row.observacionesOrigen,
			idTipoCondicionEspecial: row.idTipoCondicionEspecial,
			fechaEgreso: row.fechaEgreso,
			fechaTraslado: row.fechaTraslado,
			idTipoDestinoInhumacion: row.idTipoDestinoInhumacion,
			observacionesDestino: row.observacionesDestino,
			fechaExhumacion: row.fechaExhumacion,
			fechaReduccion: row.fechaReduccion,
			numeroReduccion: row.numeroReduccion,
			unidad: row.unidad,
			idTipoDocumentoResponsable: row.idTipoDocumentoResponsable,
			numeroDocumentoResponsable: row.numeroDocumentoResponsable,
			apellidoResponsable: row.apellidoResponsable,
			nombreResponsable: row.nombreResponsable,
			fechaHoraInicioVelatorio: row.fechaHoraInicioVelatorio,
			fechaHoraFinVelatorio: row.fechaHoraFinVelatorio
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await InhumadoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Inhumado(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await InhumadoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
