import Caja from "./caja";

export default class CajaAsignacion {

    id: number;
	idCaja: number;
	idUsuario: number;
	fechaApertura: Date;
	fechaCierre: Date;
	importeSaldoInicial: number;
	importeSaldoFinal: number;
	importeCobro: number;
	importeCobroEfectivo: number;
	idRecaudacionLote: number;

	caja: Caja = null;

	constructor(
        id: number = 0,
		idCaja: number = 0,
		idUsuario: number = 0,
		fechaApertura: Date = null,
		fechaCierre: Date = null,
		importeSaldoInicial: number = 0,
		importeSaldoFinal: number = 0,
		importeCobro: number = 0,
		importeCobroEfectivo: number = 0,
		idRecaudacionLote: number = 0
	)
	{
        this.id = id;
		this.idCaja = idCaja;
		this.idUsuario = idUsuario;
		this.fechaApertura = fechaApertura;
		this.fechaCierre = fechaCierre;
		this.importeSaldoInicial = importeSaldoInicial;
		this.importeSaldoFinal = importeSaldoFinal;
		this.importeCobro = importeCobro;
		this.importeCobroEfectivo = importeCobroEfectivo;
		this.idRecaudacionLote = idRecaudacionLote;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCaja = row.idCaja ?? 0;
		this.idUsuario = row.idUsuario ?? 0;
		this.fechaApertura = row.fechaApertura ?? null;
		this.fechaCierre = row.fechaCierre ?? null;
		this.importeSaldoInicial = row.importeSaldoInicial ?? 0;
		this.importeSaldoFinal = row.importeSaldoFinal ?? 0;
		this.importeCobro = row.importeCobro ?? 0;
		this.importeCobroEfectivo = row.importeCobroEfectivo ?? 0;
		this.idRecaudacionLote = row.idRecaudacionLote ?? 0;
	}

}
