export default class OpcionCuota {

    numeroCuota: number;
    cantidadCuotas: number;
    importeNominal: number;
    importeAccesorios: number;
    importeCapital: number;
    importeIntereses: number;
    importeSellados: number;
    importeAnticipo: number;
    importeQuita: number;
    importeQuitaRecargos: number;
    importeQuitaMultaInfracciones: number;
    importeQuitaHonorarios: number;
    importeQuitaAportes: number;
    importeCuota: number;
    importePlanPago: number;

    cuotas: Array<OpcionCuota>;

    constructor(numeroCuota: number = 0, cantidadCuotas: number = 0,
                importeNominal: number = 0, importeAccesorios: number = 0, importeCapital: number = 0,
                importeIntereses: number = 0, importeSellados: number = 0, importeAnticipo: number = 0,
                importeQuita: number = 0,
                importeQuitaRecargos: number = 0, importeQuitaMultaInfracciones: number = 0,
                importeQuitaHonorarios: number = 0, importeQuitaAportes: number = 0,
                importeCuota: number = 0, importePlanPago = 0,
                cuotas: Array<OpcionCuota> = [])
    {
        this.numeroCuota = numeroCuota;
        this.cantidadCuotas = cantidadCuotas;
        this.importeNominal = importeNominal;
        this.importeAccesorios = importeAccesorios;
        this.importeCapital = importeCapital;
        this.importeIntereses = importeIntereses;
        this.importeSellados = importeSellados;
        this.importeAnticipo = importeAnticipo;
        this.importeQuita = importeQuita;
        this.importeQuitaRecargos = importeQuitaRecargos;
        this.importeQuitaMultaInfracciones = importeQuitaMultaInfracciones;
        this.importeQuitaHonorarios = importeQuitaHonorarios;
        this.importeQuitaAportes = importeQuitaAportes;
        this.importeCuota = importeCuota;
        this.importePlanPago = importePlanPago;
        this.cuotas = cuotas;
    }

    setFromObject = (row) =>
	{
        this.numeroCuota = row.numeroCuota ?? 0;
		this.cantidadCuotas = row.cantidadCuotas ?? 0;
		this.importeNominal = row.importeNominal ?? 0;
		this.importeAccesorios = row.importeAccesorios ?? 0;
		this.importeCapital = row.importeCapital ?? 0;
        this.importeIntereses = row.importeIntereses ?? 0;
		this.importeSellados = row.importeSellados ?? 0;
		this.importeAnticipo = row.importeAnticipo ?? 0;
        this.importeQuita = row.importeQuita ?? 0;
        this.importeQuitaRecargos = row.importeQuitaRecargos ?? 0;
        this.importeQuitaMultaInfracciones = row.importeQuitaMultaInfracciones ?? 0;
        this.importeQuitaHonorarios = row.importeQuitaHonorarios ?? 0;
        this.importeQuitaAportes = row.importeQuitaAportes ?? 0;
        this.importeCuota = row.importeCuota ?? 0;
		this.importePlanPago = row.importePlanPago ?? 0;
	}

}