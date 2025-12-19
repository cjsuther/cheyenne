export default class CuentaContable {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	agrupamiento: string;
	ejercicio: string;
    tipo: number;
	ejercicioAgrupamiento: string;
	porcentajeAfectada: number;
	conChequeRetencion: boolean;
	fechaBaja: Date;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		agrupamiento: string = "",
		ejercicio: string = "",
		tipo: number = 0,
		ejercicioAgrupamiento: string = "",
		porcentajeAfectada: number = 0,
		conChequeRetencion: boolean = false,
		fechaBaja: Date  = null
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.agrupamiento = agrupamiento;
		this.ejercicio = ejercicio;
		this.tipo = tipo;
		this.ejercicioAgrupamiento = ejercicioAgrupamiento;
		this.porcentajeAfectada = porcentajeAfectada;
		this.conChequeRetencion = conChequeRetencion;
		this.fechaBaja = fechaBaja;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.agrupamiento = row.agrupamiento ?? "";
		this.ejercicio = row.ejercicio ?? "";
		this.tipo = row.tipo ?? 0;
		this.ejercicioAgrupamiento = row.ejercicioAgrupamiento ?? "";
		this.porcentajeAfectada = row.porcentajeAfectada ?? 0;
		this.conChequeRetencion = row.conChequeRetencion ?? false;
		this.fechaBaja = row.fechaBaja ?? null;
	}

}
