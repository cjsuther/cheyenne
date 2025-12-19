export default class PersonaFisica {

    id: number;
	idTipoDocumento: number;
	numeroDocumento: string;
	idNacionalidad: number;
	nombre: string;
	apellido: string;
	idGenero: number;
	idEstadoCivil: number;
	idNivelEstudio: number;
	profesion: string;
	matricula: string;
	fechaNacimiento: Date;
	fechaDefuncion: Date;
	discapacidad: boolean;
	idCondicionFiscal: number;
	idIngresosBrutos: number;
	ganancias: boolean;
	pin: string;
	foto: string;

	constructor(
        id: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		idNacionalidad: number = 0,
		nombre: string = "",
		apellido: string = "",
		idGenero: number = 0,
		idEstadoCivil: number = 0,
		idNivelEstudio: number = 0,
		profesion: string = "",
		matricula: string = "",
		fechaNacimiento: Date = null,
		fechaDefuncion: Date = null,
		discapacidad: boolean = false,
		idCondicionFiscal: number = 0,
		idIngresosBrutos: number = 0,
		ganancias: boolean = false,
		pin: string = "",
		foto: string = ""
	)
	{
        this.id = id;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.idNacionalidad = idNacionalidad;
		this.nombre = nombre;
		this.apellido = apellido;
		this.idGenero = idGenero;
		this.idEstadoCivil = idEstadoCivil;
		this.idNivelEstudio = idNivelEstudio;
		this.profesion = profesion;
		this.matricula = matricula;
		this.fechaNacimiento = fechaNacimiento;
		this.fechaDefuncion = fechaDefuncion;
		this.discapacidad = discapacidad;
		this.idCondicionFiscal = idCondicionFiscal;
		this.idIngresosBrutos = idIngresosBrutos;
		this.ganancias = ganancias;
		this.pin = pin;
		this.foto = foto;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.idNacionalidad = row.idNacionalidad ?? 0;
		this.nombre = row.nombre ?? "";
		this.apellido = row.apellido ?? "";
		this.idGenero = row.idGenero ?? 0;
		this.idEstadoCivil = row.idEstadoCivil ?? 0;
		this.idNivelEstudio = row.idNivelEstudio ?? 0;
		this.profesion = row.profesion ?? "";
		this.matricula = row.matricula ?? "";
		this.fechaNacimiento = row.fechaNacimiento ?? null;
		this.fechaDefuncion = row.fechaDefuncion ?? null;
		this.discapacidad = row.discapacidad ?? false;
		this.idCondicionFiscal = row.idCondicionFiscal ?? 0;
		this.idIngresosBrutos = row.idIngresosBrutos ?? 0;
		this.ganancias = row.ganancias ?? false;
		this.pin = row.pin ?? "";
		this.foto = row.foto ?? "";
	}

}
