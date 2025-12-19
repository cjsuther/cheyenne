
export default class Cementerio {

    id: number;
    idCuenta: number;
    idEstadoCarga: number;
    fechaCargaInicio: Date;
    fechaCargaFin: Date;
	idTipoConstruccionFuneraria: number;
	idCementerio: number;
	circunscripcionCementerio: string;
	seccionCementerio: string;
	manzanaCementerio: string;
	parcelaCementerio: string;
	frenteCementerio: string;
	filaCementerio: string;
	numeroCementerio: string;
	fechaAlta: Date;
	fechaBaja: Date;
	fechaPresentacion: Date;
	digitoVerificador: string;
	fechaConcesion: Date;
	fechaEscritura: Date;
	fechaSucesion: Date;
	libroEscritura: string;
	folioEscritura: string;
	numeroSucesion: string;
	superficie: number;
	largo: number;
	ancho: number;    

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        idEstadoCarga: number = 0,
        fechaCargaInicio: Date = null,
        fechaCargaFin: Date = null,
        idTipoConstruccionFuneraria: number = 0,
		idCementerio: number = 0,
		circunscripcionCementerio: string = "",
		seccionCementerio: string = "",
		manzanaCementerio: string = "",
		parcelaCementerio: string = "",
		frenteCementerio: string = "",
		filaCementerio: string = "",
		numeroCementerio: string = "",
		fechaAlta: Date = null,
		fechaBaja: Date = null,
		fechaPresentacion: Date = null,
		digitoVerificador: string = "",
		fechaConcesion: Date = null,
		fechaEscritura: Date = null,
		fechaSucesion: Date = null,
		libroEscritura: string = "",
		folioEscritura: string = "",
		numeroSucesion: string = "",
		superficie: number = 0,
		largo: number = 0,
		ancho: number = 0)
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.idEstadoCarga = idEstadoCarga;
        this.fechaCargaInicio = fechaCargaInicio;
        this.fechaCargaFin = fechaCargaFin;
		this.idTipoConstruccionFuneraria = idTipoConstruccionFuneraria;
		this.idCementerio = idCementerio;
		this.circunscripcionCementerio = circunscripcionCementerio;
		this.seccionCementerio = seccionCementerio;
		this.manzanaCementerio = manzanaCementerio;
		this.parcelaCementerio = parcelaCementerio;
		this.frenteCementerio = frenteCementerio;
		this.filaCementerio = filaCementerio;
		this.numeroCementerio = numeroCementerio;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
		this.fechaPresentacion = fechaPresentacion;
		this.digitoVerificador = digitoVerificador;
		this.fechaConcesion = fechaConcesion;
		this.fechaEscritura = fechaEscritura;
		this.fechaSucesion = fechaSucesion;
		this.libroEscritura = libroEscritura;
		this.folioEscritura = folioEscritura;
		this.numeroSucesion = numeroSucesion;
		this.superficie = superficie;
		this.largo = largo;
		this.ancho = ancho;            
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.idCuenta = row.idCuenta ?? 0;
        this.idEstadoCarga = row.idEstadoCarga ?? 0;
        this.fechaCargaInicio = row.fechaCargaInicio ?? null;
        this.fechaCargaFin = row.fechaCargaFin ?? null;
		this.idTipoConstruccionFuneraria = row.idTipoConstruccionFuneraria ?? 0;
		this.idCementerio = row.idCementerio ?? 0;
		this.circunscripcionCementerio = row.circunscripcionCementerio ?? "";
		this.seccionCementerio = row.seccionCementerio ?? "";
		this.manzanaCementerio = row.manzanaCementerio ?? "";
		this.parcelaCementerio = row.parcelaCementerio ?? "";
		this.frenteCementerio = row.frenteCementerio ?? "";
		this.filaCementerio = row.filaCementerio ?? "";
		this.numeroCementerio = row.numeroCementerio ?? "";
		this.fechaAlta = row.fechaAlta ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
		this.fechaPresentacion = row.fechaPresentacion ?? null;
		this.digitoVerificador = row.digitoVerificador ?? "";
		this.fechaConcesion = row.fechaConcesion ?? null;
		this.fechaEscritura = row.fechaEscritura ?? null;
		this.fechaSucesion = row.fechaSucesion ?? null;
		this.libroEscritura = row.libroEscritura ?? "";
		this.folioEscritura = row.folioEscritura ?? "";
		this.numeroSucesion = row.numeroSucesion ?? "";
		this.superficie = row.superficie ?? 0;
		this.largo = row.largo ?? 0;
		this.ancho = row.ancho ?? 0;        
    }
    
}
