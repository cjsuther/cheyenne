import Edesur from "../entities/edesur";
import EdesurClienteState from "./edesur-cliente-state";


export default class EdesurState extends Edesur {

    state: string;
	edesurClientes: Array<EdesurClienteState>;


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
		numeroEdesur: string = "",
		state: string = "o",
        edesurClientes: Array<EdesurClienteState> = []
	)
	{
        super(id, idInmueble, ultPeriodoEdesur, ultCuotaEdesur, ultImporteEdesur, medidor, idFrecuenciaFacturacion, plan, radio, manzana, idAnteriorEdesur, tarifa, tarifa1, claseServicio, porcDesc, cAnual, recorrido, planB, lzEdesur, facturarABL, facturar, facturarEdesur, comuna, calleEdesur, numeroEdesur);
		this.state = state;
		this.edesurClientes = edesurClientes;
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
		this.state = row.state ?? "o";
		this.edesurClientes = row.edesurClientes.map(x => {
            let item = new EdesurClienteState();
            item.setFromObject(x);
            return item;
        });
	}

}
