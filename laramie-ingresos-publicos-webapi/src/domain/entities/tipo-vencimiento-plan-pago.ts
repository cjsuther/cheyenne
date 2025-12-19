export default class TipoVencimientoPlanPago {

    id: number;
	descripcion: string;
	baseDiaActual: boolean;
	baseDiaFinMes: boolean;
	habiles: boolean;
	proximoHabil: boolean;
	anteriorHabil: boolean;
	dias: number;
	meses: number;

	constructor(
        id: number = 0,
		descripcion: string = "",
		baseDiaActual: boolean = false,
		baseDiaFinMes: boolean = false,
		habiles: boolean = false,
		proximoHabil: boolean = false,
		anteriorHabil: boolean = false,
		dias: number = 0,
		meses: number = 0
	)
	{
        this.id = id;
		this.descripcion = descripcion;
		this.baseDiaActual = baseDiaActual;
		this.baseDiaFinMes = baseDiaFinMes;
		this.habiles = habiles;
		this.proximoHabil = proximoHabil;
		this.anteriorHabil = anteriorHabil;
		this.dias = dias;
		this.meses = meses;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.descripcion = row.descripcion ?? "";
		this.baseDiaActual = row.baseDiaActual ?? false;
		this.baseDiaFinMes = row.baseDiaFinMes ?? false;
		this.habiles = row.habiles ?? false;
		this.proximoHabil = row.proximoHabil ?? false;
		this.anteriorHabil = row.anteriorHabil ?? false;
		this.dias = row.dias ?? 0;
		this.meses = row.meses ?? 0;
	}

}
