export default class DeclaracionJurada {

    id: number;
	idCuenta: number;
	idTipoTributo: number;
	idTributo: number;
	idTasa: number;
	idSubTasa: number;
	fechaPresentacionDDJJ: Date;
	anioDeclaracion: string;
	mesDeclaracion: number;
	numero: string;
	idTipoDDJJ: number;
	valorDeclaracion: number;
	fechaAlta: Date;
	fechaBaja: Date;
	resolucion: string;

	constructor(
        id: number = 0,
		idCuenta: number = 0,
		idTipoTributo: number = 0,
		idTributo: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		fechaPresentacionDDJJ: Date = null,
		anioDeclaracion: string = "",
		mesDeclaracion: number = 0,
		numero: string = "",
		idTipoDDJJ: number = 0,
		valorDeclaracion: number = 0,
		fechaAlta: Date = null,
		fechaBaja: Date = null,
		resolucion: string = ""
	)
	{
        this.id = id;
		this.idCuenta = idCuenta;
		this.idTipoTributo = idTipoTributo;
		this.idTributo = idTributo;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.fechaPresentacionDDJJ = fechaPresentacionDDJJ;
		this.anioDeclaracion = anioDeclaracion;
		this.mesDeclaracion = mesDeclaracion;
		this.numero = numero;
		this.idTipoDDJJ = idTipoDDJJ;
		this.valorDeclaracion = valorDeclaracion;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
		this.resolucion = resolucion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.idTributo = row.idTributo ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.fechaPresentacionDDJJ = row.fechaPresentacionDDJJ ?? null;
		this.anioDeclaracion = row.anioDeclaracion ?? "";
		this.mesDeclaracion = row.mesDeclaracion ?? 0;
		this.numero = row.numero ?? "";
		this.idTipoDDJJ = row.idTipoDDJJ ?? 0;
		this.valorDeclaracion = row.valorDeclaracion ?? 0;
		this.fechaAlta = row.fechaAlta ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
		this.resolucion = row.resolucion ?? "";
	}

}
