export default class DeclaracionJuradaComercio {

    id: number;
	idCuenta: number;
	fechaPresentacionDDJJ: Date;
	anioDeclaracion: string;
	mesDeclaracion: number;
	numero: number;
	idTipoDDJJ: number;
	fechaAlta: Date;
	fechaBaja: Date;
	resolucion: string;
	titulares: number;
	dependientes: number;
	importeExportaciones: number;
	importeTotalPais: number;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		fechaPresentacionDDJJ: Date = null,
		anioDeclaracion: string = "",
		mesDeclaracion: number = 0,
		numero: number = 0,
		idTipoDDJJ: number = 0,
		fechaAlta: Date = null,
		fechaBaja: Date = null,
		resolucion: string = "",
		titulares: number = 0,
		dependientes: number = 0,
		importeExportaciones: number = 0,
		importeTotalPais: number = 0
	)
	{
        this.id = id;
		this.idCuenta = idCuenta;
		this.fechaPresentacionDDJJ = fechaPresentacionDDJJ;
		this.anioDeclaracion = anioDeclaracion;
		this.mesDeclaracion = mesDeclaracion;
		this.numero = numero;
		this.idTipoDDJJ = idTipoDDJJ;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
		this.resolucion = resolucion;
		this.titulares = titulares;
		this.dependientes = dependientes;
		this.importeExportaciones = importeExportaciones;
		this.importeTotalPais = importeTotalPais;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.fechaPresentacionDDJJ = row.fechaPresentacionDDJJ ?? null;
		this.anioDeclaracion = row.anioDeclaracion ?? "";
		this.mesDeclaracion = row.mesDeclaracion ?? 0;
		this.numero = row.numero ?? 0;
		this.idTipoDDJJ = row.idTipoDDJJ ?? 0;
		this.fechaAlta = row.fechaAlta ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
		this.resolucion = row.resolucion ?? "";
		this.titulares = row.titulares ?? 0;
		this.dependientes = row.dependientes ?? 0;
		this.importeExportaciones = row.importeExportaciones ?? 0;
		this.importeTotalPais = row.importeTotalPais ?? 0;
	}

}
