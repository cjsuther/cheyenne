import Direccion from "../entities/direccion";
import Inhumado from "../entities/inhumado";
import VerificacionState from "./verificacion-state";

export default class InhumadoState extends Inhumado {

	state: string;
	direccion: Direccion;
	verificaciones: Array<VerificacionState>;

	constructor(
        id: number = 0,
		idCementerio: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		apellido: string = "",
		nombre: string = "",
		fechaNacimiento: Date = null,
		idGenero: number = 0,
		idEstadoCivil: number = 0,
		idNacionalidad: number = 0,
		fechaDefuncion: Date = null,
		fechaIngreso: Date = null,
		idMotivoFallecimiento: number = 0,
		idCocheria: number = 0,
		numeroDefuncion: string = "",
		libro: string = "",
		folio: string = "",
		idRegistroCivil: number = 0,
		acta: string = "",
		idTipoOrigenInhumacion: number = 0,
		observacionesOrigen: string = "",
		idTipoCondicionEspecial: number = 0,
		fechaEgreso: Date = null,
		fechaTraslado: Date = null,
		idTipoDestinoInhumacion: number = 0,
		observacionesDestino: string = "",
		fechaExhumacion: Date = null,
		fechaReduccion: Date = null,
		numeroReduccion: string = "",
		unidad: string = "",
		idTipoDocumentoResponsable: number = 0,
		numeroDocumentoResponsable: string = "",
		apellidoResponsable: string = "",
		nombreResponsable: string = "",
		fechaHoraInicioVelatorio: Date = null,
		fechaHoraFinVelatorio: Date = null,
		state: string = "o",
		direccion: Direccion = null,
		verificaciones: Array<VerificacionState> = []
	)
	{
        super(
			id, idCementerio, idTipoDocumento, numeroDocumento, apellido, nombre, fechaNacimiento,
			idGenero, idEstadoCivil, idNacionalidad, fechaDefuncion, fechaIngreso, idMotivoFallecimiento, idCocheria,
			numeroDefuncion, libro, folio, idRegistroCivil, acta, idTipoOrigenInhumacion, observacionesOrigen,
			idTipoCondicionEspecial, fechaEgreso, fechaTraslado, idTipoDestinoInhumacion, observacionesDestino,
			fechaExhumacion, fechaReduccion, numeroReduccion, unidad, idTipoDocumentoResponsable, numeroDocumentoResponsable,
			apellidoResponsable, nombreResponsable, fechaHoraInicioVelatorio, fechaHoraFinVelatorio
			);
		this.state = state;
		this.direccion = direccion;
		this.verificaciones = verificaciones;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCementerio = row.idCementerio ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.apellido = row.apellido ?? "";
		this.nombre = row.nombre ?? "";
		this.fechaNacimiento = row.fechaNacimiento ?? null;
		this.idGenero = row.idGenero ?? 0;
		this.idEstadoCivil = row.idEstadoCivil ?? 0;
		this.idNacionalidad = row.idNacionalidad ?? 0;
		this.fechaDefuncion = row.fechaDefuncion ?? null;
		this.fechaIngreso = row.fechaIngreso ?? null;
		this.idMotivoFallecimiento = row.idMotivoFallecimiento ?? 0;
		this.idCocheria = row.idCocheria ?? 0;
		this.numeroDefuncion = row.numeroDefuncion ?? "";
		this.libro = row.libro ?? "";
		this.folio = row.folio ?? "";
		this.idRegistroCivil = row.idRegistroCivil ?? 0;
		this.acta = row.acta ?? "";
		this.idTipoOrigenInhumacion = row.idTipoOrigenInhumacion ?? 0;
		this.observacionesOrigen = row.observacionesOrigen ?? "";
		this.idTipoCondicionEspecial = row.idTipoCondicionEspecial ?? 0;
		this.fechaEgreso = row.fechaEgreso ?? null;
		this.fechaTraslado = row.fechaTraslado ?? null;
		this.idTipoDestinoInhumacion = row.idTipoDestinoInhumacion ?? 0;
		this.observacionesDestino = row.observacionesDestino ?? "";
		this.fechaExhumacion = row.fechaExhumacion ?? null;
		this.fechaReduccion = row.fechaReduccion ?? null;
		this.numeroReduccion = row.numeroReduccion ?? "";
		this.unidad = row.unidad ?? "";
		this.idTipoDocumentoResponsable = row.idTipoDocumentoResponsable ?? 0;
		this.numeroDocumentoResponsable = row.numeroDocumentoResponsable ?? "";
		this.apellidoResponsable = row.apellidoResponsable ?? "";
		this.nombreResponsable = row.nombreResponsable ?? "";
		this.fechaHoraInicioVelatorio = row.fechaHoraInicioVelatorio ?? null;
		this.fechaHoraFinVelatorio = row.fechaHoraFinVelatorio ?? null;
		this.state = row.state ?? "o";
		this.direccion = new Direccion();
		this.direccion.setFromObject(row.direccion);
		this.verificaciones = row.verificaciones.map(x => {
            let item = new VerificacionState();
            item.setFromObject(x);
            return item;
        });
	}

}
