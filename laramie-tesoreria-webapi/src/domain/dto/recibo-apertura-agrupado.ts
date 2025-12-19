export default class ReciboAperturaAgrupado {

	idReciboPublicacion: number;
	codigoTasa: string;
	codigoSubTasa: string;
	periodo: string;
	cuota: number;
	importe1: number;
	importe2: number;

	constructor(
		idReciboPublicacion: number = 0,
		codigoTasa: string = "",
		codigoSubTasa: string = "",
		periodo: string = "",
		cuota: number = 0,
		importe1: number = 0,
		importe2: number = 0
	)
	{
		this.idReciboPublicacion = idReciboPublicacion;
		this.codigoTasa = codigoTasa;
		this.codigoSubTasa = codigoSubTasa;
		this.periodo = periodo;
		this.cuota = cuota;
		this.importe1 = importe1;
		this.importe2 = importe2;
	}

	setFromObject = (row) =>
	{
		this.idReciboPublicacion = row.idReciboPublicacion ?? 0;
		this.codigoTasa = row.codigoTasa ?? "";
		this.codigoSubTasa = row.codigoSubTasa ?? "";
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.importe1 = row.importe1 ?? 0;
		this.importe2 = row.importe2 ?? 0;
	}

}