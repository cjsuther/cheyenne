export default class EmisionNumeracion {

    id: number;
	nombre: string;
	idTipoTributo: number;
	valorProximo: number;
	valorReservadoDesde: number;
	valorReservadoHasta: number;
	idEmisionEjecucionBloqueo: number;

	constructor(
        id: number = 0,
		nombre: string = "",
		idTipoTributo: number = 0,
		valorProximo: number = 0,
		valorReservadoDesde: number = 0,
		valorReservadoHasta: number = 0,
		idEmisionEjecucionBloqueo: number = 0
	)
	{
        this.id = id;
		this.nombre = nombre;
		this.idTipoTributo = idTipoTributo;
		this.valorProximo = valorProximo;
		this.valorReservadoDesde = valorReservadoDesde;
		this.valorReservadoHasta = valorReservadoHasta;
		this.idEmisionEjecucionBloqueo = idEmisionEjecucionBloqueo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.nombre = row.nombre ?? "";
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.valorProximo = row.valorProximo ?? 0;
		this.valorReservadoDesde = row.valorReservadoDesde ?? 0;
		this.valorReservadoHasta = row.valorReservadoHasta ?? 0;
		this.idEmisionEjecucionBloqueo = row.idEmisionEjecucionBloqueo ?? 0;
	}

}
