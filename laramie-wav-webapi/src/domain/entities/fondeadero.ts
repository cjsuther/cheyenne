
export default class Fondeadero {

    id: number;
    idCuenta: number;
    idEstadoCarga: number;
    fechaCargaInicio: Date;
    fechaCargaFin: Date;
	idTasa: number;
	idSubTasa: number;
	idTipoFondeadero: number;
	embarcacion: string;
	superficie: string;
	longitud: string;
	codigo: string;
	club: string;
	digitoVerificador: string;
	ubicacion: string;
	margen: string;
	fechaAlta: Date;

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        idEstadoCarga: number = 0,
        fechaCargaInicio: Date = null,
        fechaCargaFin: Date = null,
		idTasa: number = 0,
		idSubTasa: number = 0,
		idTipoFondeadero: number = 0,
		embarcacion: string = "",
		superficie: string = "",
		longitud: string = "",
		codigo: string = "",
		club: string = "",
		digitoVerificador: string = "",
		ubicacion: string = "",
		margen: string = "",
		fechaAlta: Date = null        
    ){
        this.id = id;
        this.idCuenta = idCuenta;
        this.idEstadoCarga = idEstadoCarga;
        this.fechaCargaInicio = fechaCargaInicio;
        this.fechaCargaFin = fechaCargaFin;     
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.idTipoFondeadero = idTipoFondeadero;
		this.embarcacion = embarcacion;
		this.superficie = superficie;
		this.longitud = longitud;
		this.codigo = codigo;
		this.club = club;
		this.digitoVerificador = digitoVerificador;
		this.ubicacion = ubicacion;
		this.margen = margen;
		this.fechaAlta = fechaAlta;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.idCuenta = row.idCuenta ?? 0;
        this.idEstadoCarga = row.idEstadoCarga ?? 0;
        this.fechaCargaInicio = row.fechaCargaInicio ?? null;
        this.fechaCargaFin = row.fechaCargaFin ?? null;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.idTipoFondeadero = row.idTipoFondeadero ?? 0;
		this.embarcacion = row.embarcacion ?? "";
		this.superficie = row.superficie ?? "";
		this.longitud = row.longitud ?? "";
		this.codigo = row.codigo ?? "";
		this.club = row.club ?? "";
		this.digitoVerificador = row.digitoVerificador ?? "";
		this.ubicacion = row.ubicacion ?? "";
		this.margen = row.margen ?? "";
		this.fechaAlta = row.fechaAlta ?? null;
    }    
}
