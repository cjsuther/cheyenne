export default class CuotaPorcentaje {

    id: number;
	idEmisionEjecucion: number;
	idEmisionImputacionContableResultado: number;
	idCuenta: number;
	idTasa: number;
	idSubTasa: number;
	periodo: string;
	cuota: number;
	idTasaPorcentaje: number;
	idSubTasaPorcentaje: number;
	porcentaje: number;
	importePorcentaje: number;
	ejercicio: string;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idEmisionImputacionContableResultado: number = 0,
		idCuenta: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		periodo: string = "",
		cuota: number = 0,
		idTasaPorcentaje: number = 0,
		idSubTasaPorcentaje: number = 0,
		porcentaje: number = 0,
		importePorcentaje: number = 0,
		ejercicio: string = ""
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idEmisionImputacionContableResultado = idEmisionImputacionContableResultado;
		this.idCuenta = idCuenta;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.periodo = periodo;
		this.cuota = cuota;
		this.idTasaPorcentaje = idTasaPorcentaje;
		this.idSubTasaPorcentaje = idSubTasaPorcentaje;
		this.porcentaje = porcentaje;
		this.importePorcentaje = importePorcentaje;
		this.ejercicio = ejercicio;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idEmisionImputacionContableResultado = row.idEmisionImputacionContableResultado ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.idTasaPorcentaje = row.idTasaPorcentaje ?? 0;
		this.idSubTasaPorcentaje = row.idSubTasaPorcentaje ?? 0;
		this.porcentaje = row.porcentaje ?? 0;
		this.importePorcentaje = row.importePorcentaje ?? 0;
		this.ejercicio = row.ejercicio ?? "";
	}

}
