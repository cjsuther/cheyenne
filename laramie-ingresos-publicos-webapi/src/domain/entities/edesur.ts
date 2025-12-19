export default class Edesur {

    id: number;
	idInmueble: number;
	ultPeriodoEdesur: string;
	ultCuotaEdesur: string;
	ultImporteEdesur: number;
	medidor: string;
	idFrecuenciaFacturacion: number;
	plan: string;
	radio: string;
	manzana: string;
	idAnteriorEdesur: string;
	tarifa: number;
	tarifa1: number;
	claseServicio: string;
	porcDesc: number;
	cAnual: string;
	recorrido: string;
	planB: string;
	lzEdesur: boolean;
	facturarABL: boolean;
	facturar: boolean;
	facturarEdesur: boolean;
	comuna: string;
	calleEdesur: string;
	numeroEdesur: string;

	constructor(
        id: number = 0,
		idInmueble: number = 0,
		ultPeriodoEdesur: string = "",
		ultCuotaEdesur: string = "",
		ultImporteEdesur: number = 0,
		medidor: string = "",
		idFrecuenciaFacturacion: number = 0,
		plan: string = "",
		radio: string = "",
		manzana: string = "",
		idAnteriorEdesur: string = "",
		tarifa: number = 0,
		tarifa1: number = 0,
		claseServicio: string = "",
		porcDesc: number = 0,
		cAnual: string = "",
		recorrido: string = "",
		planB: string = "",
		lzEdesur: boolean = false,
		facturarABL: boolean = false,
		facturar: boolean = false,
		facturarEdesur: boolean = false,
		comuna: string = "",
		calleEdesur: string = "",
		numeroEdesur: string = ""
	)
	{
        this.id = id;
		this.idInmueble = idInmueble;
		this.ultPeriodoEdesur = ultPeriodoEdesur;
		this.ultCuotaEdesur = ultCuotaEdesur;
		this.ultImporteEdesur = ultImporteEdesur;
		this.medidor = medidor;
		this.idFrecuenciaFacturacion = idFrecuenciaFacturacion;
		this.plan = plan;
		this.radio = radio;
		this.manzana = manzana;
		this.idAnteriorEdesur = idAnteriorEdesur;
		this.tarifa = tarifa;
		this.tarifa1 = tarifa1;
		this.claseServicio = claseServicio;
		this.porcDesc = porcDesc;
		this.cAnual = cAnual;
		this.recorrido = recorrido;
		this.planB = planB;
		this.lzEdesur = lzEdesur;
		this.facturarABL = facturarABL;
		this.facturar = facturar;
		this.facturarEdesur = facturarEdesur;
		this.comuna = comuna;
		this.calleEdesur = calleEdesur;
		this.numeroEdesur = numeroEdesur;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idInmueble = row.idInmueble ?? 0;
		this.ultPeriodoEdesur = row.ultPeriodoEdesur ?? "";
		this.ultCuotaEdesur = row.ultCuotaEdesur ?? "";
		this.ultImporteEdesur = row.ultImporteEdesur ?? 0;
		this.medidor = row.medidor ?? "";
		this.idFrecuenciaFacturacion = row.idFrecuenciaFacturacion ?? 0;
		this.plan = row.plan ?? "";
		this.radio = row.radio ?? "";
		this.manzana = row.manzana ?? "";
		this.idAnteriorEdesur = row.idAnteriorEdesur ?? "";
		this.tarifa = row.tarifa ?? 0;
		this.tarifa1 = row.tarifa1 ?? 0;
		this.claseServicio = row.claseServicio ?? "";
		this.porcDesc = row.porcDesc ?? 0;
		this.cAnual = row.cAnual ?? "";
		this.recorrido = row.recorrido ?? "";
		this.planB = row.planB ?? "";
		this.lzEdesur = row.lzEdesur ?? false;
		this.facturarABL = row.facturarABL ?? false;
		this.facturar = row.facturar ?? false;
		this.facturarEdesur = row.facturarEdesur ?? false;
		this.comuna = row.comuna ?? "";
		this.calleEdesur = row.calleEdesur ?? "";
		this.numeroEdesur = row.numeroEdesur ?? "";
	}

}