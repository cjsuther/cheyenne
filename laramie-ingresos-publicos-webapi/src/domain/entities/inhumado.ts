export default class Inhumado {

    id: number;
	idCementerio: number;
	idTipoDocumento: number;
	numeroDocumento: string;
	apellido: string;
	nombre: string;
	fechaNacimiento: Date;
	idGenero: number;
	idEstadoCivil: number;
	idNacionalidad: number;
	fechaDefuncion: Date;
	fechaIngreso: Date;
	idMotivoFallecimiento: number;
	idCocheria: number;
	numeroDefuncion: string;
	libro: string;
	folio: string;
	idRegistroCivil: number;
	acta: string;
	idTipoOrigenInhumacion: number;
	observacionesOrigen: string;
	idTipoCondicionEspecial: number;
	fechaEgreso: Date;
	fechaTraslado: Date;
	idTipoDestinoInhumacion: number;
	observacionesDestino: string;
	fechaExhumacion: Date;
	fechaReduccion: Date;
	numeroReduccion: string;
	unidad: string;
	idTipoDocumentoResponsable: number;
	numeroDocumentoResponsable: string;
	apellidoResponsable: string;
	nombreResponsable: string;
	fechaHoraInicioVelatorio: Date;
	fechaHoraFinVelatorio: Date;

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
		fechaHoraFinVelatorio: Date = null
	)
	{
        this.id = id;
		this.idCementerio = idCementerio;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.apellido = apellido;
		this.nombre = nombre;
		this.fechaNacimiento = fechaNacimiento;
		this.idGenero = idGenero;
		this.idEstadoCivil = idEstadoCivil;
		this.idNacionalidad = idNacionalidad;
		this.fechaDefuncion = fechaDefuncion;
		this.fechaIngreso = fechaIngreso;
		this.idMotivoFallecimiento = idMotivoFallecimiento;
		this.idCocheria = idCocheria;
		this.numeroDefuncion = numeroDefuncion;
		this.libro = libro;
		this.folio = folio;
		this.idRegistroCivil = idRegistroCivil;
		this.acta = acta;
		this.idTipoOrigenInhumacion = idTipoOrigenInhumacion;
		this.observacionesOrigen = observacionesOrigen;
		this.idTipoCondicionEspecial = idTipoCondicionEspecial;
		this.fechaEgreso = fechaEgreso;
		this.fechaTraslado = fechaTraslado;
		this.idTipoDestinoInhumacion = idTipoDestinoInhumacion;
		this.observacionesDestino = observacionesDestino;
		this.fechaExhumacion = fechaExhumacion;
		this.fechaReduccion = fechaReduccion;
		this.numeroReduccion = numeroReduccion;
		this.unidad = unidad;
		this.idTipoDocumentoResponsable = idTipoDocumentoResponsable;
		this.numeroDocumentoResponsable = numeroDocumentoResponsable;
		this.apellidoResponsable = apellidoResponsable;
		this.nombreResponsable = nombreResponsable;
		this.fechaHoraInicioVelatorio = fechaHoraInicioVelatorio;
		this.fechaHoraFinVelatorio = fechaHoraFinVelatorio;
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
	}

}
