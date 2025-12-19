import SubTasaImputacion from "../entities/sub-tasa-imputacion";

export default class SubTasaImputacionState extends SubTasaImputacion {

	state: string;

	constructor(
        id: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		ejercicio: string = "",
		idTipoCuota: number = 0,
		idCuentaContable: number = 0,
		idCuentaContableAnterior: number = 0,
		idCuentaContableFutura: number = 0,
		idJurisdiccionActual: number = 0,
		idRecursoPorRubroActual: number = 0,
		idJurisdiccionAnterior: number = 0,
		idRecursoPorRubroAnterior: number = 0,
		idJurisdiccionFutura: number = 0,
		idRecursoPorRubroFutura: number = 0,
		state: string = "o"
	)
	{
		super(
			id,	idTasa,	idSubTasa, ejercicio, idTipoCuota, idCuentaContable, idCuentaContableAnterior, idCuentaContableFutura, 
			idJurisdiccionActual, idRecursoPorRubroActual, idJurisdiccionAnterior, idRecursoPorRubroAnterior,
			idJurisdiccionFutura, idRecursoPorRubroFutura
		);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.ejercicio = row.ejercicio ?? "";
		this.idTipoCuota = row.idTipoCuota ?? 0;
		this.idCuentaContable = row.idCuentaContable ?? 0;
		this.idCuentaContableAnterior = row.idCuentaContableAnterior ?? 0;
		this.idCuentaContableFutura = row.idCuentaContableFutura ?? 0;
		this.idJurisdiccionActual = row.idJurisdiccionActual ?? 0;
		this.idRecursoPorRubroActual = row.idRecursoPorRubroActual ?? 0;
		this.idJurisdiccionAnterior = row.idJurisdiccionAnterior ?? 0;
		this.idRecursoPorRubroAnterior = row.idRecursoPorRubroAnterior ?? 0;
		this.idJurisdiccionFutura = row.idJurisdiccionFutura ?? 0;
		this.idRecursoPorRubroFutura = row.idRecursoPorRubroFutura ?? 0;
		this.state = row.state ?? "o";
	}

}
