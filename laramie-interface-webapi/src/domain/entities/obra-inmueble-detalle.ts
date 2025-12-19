export default class ObraInmuebleDetalle {

    id: number;
	idObraInmueble: number;
	idTipoObra: number;
	idDestinoObra: number;
	idFormaPresentacionObra: number;
	idFormaCalculoObra: number;
	sujetoDemolicion: boolean;
	generarSuperficie: boolean;
	tipoSuperficie: string;
	descripcion: string;
	valor: number;
	alicuota: number;
	metros: number;
	montoPresupuestado: number;
	montoCalculado: number;

	constructor(
        id: number = 0,
		idObraInmueble: number = 0,
		idTipoObra: number = 0,
		idDestinoObra: number = 0,
		idFormaPresentacionObra: number = 0,
		idFormaCalculoObra: number = 0,
		sujetoDemolicion: boolean = false,
		generarSuperficie: boolean = false,
		tipoSuperficie: string = "",
		descripcion: string = "",
		valor: number = 0,
		alicuota: number = 0,
		metros: number = 0,
		montoPresupuestado: number = 0,
		montoCalculado: number = 0
	)
	{
        this.id = id;
		this.idObraInmueble = idObraInmueble;
		this.idTipoObra = idTipoObra;
		this.idDestinoObra = idDestinoObra;
		this.idFormaPresentacionObra = idFormaPresentacionObra;
		this.idFormaCalculoObra = idFormaCalculoObra;
		this.sujetoDemolicion = sujetoDemolicion;
		this.generarSuperficie = generarSuperficie;
		this.tipoSuperficie = tipoSuperficie;
		this.descripcion = descripcion;
		this.valor = valor;
		this.alicuota = alicuota;
		this.metros = metros;
		this.montoPresupuestado = montoPresupuestado;
		this.montoCalculado = montoCalculado;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idObraInmueble = row.idObraInmueble ?? 0;
		this.idTipoObra = row.idTipoObra ?? 0;
		this.idDestinoObra = row.idDestinoObra ?? 0;
		this.idFormaPresentacionObra = row.idFormaPresentacionObra ?? 0;
		this.idFormaCalculoObra = row.idFormaCalculoObra ?? 0;
		this.sujetoDemolicion = row.sujetoDemolicion ?? false;
		this.generarSuperficie = row.generarSuperficie ?? false;
		this.tipoSuperficie = row.tipoSuperficie ?? "";
		this.descripcion = row.descripcion ?? "";
		this.valor = row.valor ?? 0;
		this.alicuota = row.alicuota ?? 0;
		this.metros = row.metros ?? 0;
		this.montoPresupuestado = row.montoPresupuestado ?? 0;
		this.montoCalculado = row.montoCalculado ?? 0;
	}

}
