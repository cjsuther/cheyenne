import ObraInmuebleDetalle from "../entities/obra-inmueble-detalle";

export default class ObraInmuebleDetalleState extends ObraInmuebleDetalle {

    state: string;

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
		montoCalculado: number = 0,
		state: string = "o"
	)
	{
        super(id, idObraInmueble, idTipoObra, idDestinoObra, idFormaPresentacionObra, idFormaCalculoObra,
				sujetoDemolicion, generarSuperficie, tipoSuperficie, descripcion,
				valor, alicuota, metros, montoPresupuestado, montoCalculado);
		this.state = state;
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
		this.state = row.state ?? "o";
	}

}
