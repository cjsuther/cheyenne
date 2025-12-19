export default class TipoActoProcesal {

    id: number;
	idTipoActoProcesal: number;
	codigoActoProcesal: string;
	descripcion: string;
	plazoDias: number;
	porcentajeHonorarios: number;
	fechaBaja: Date;
	nivel: number;
	orden: number;

	constructor(
        id: number = 0,
		idTipoActoProcesal: number = 0,
		codigoActoProcesal: string = "",
		descripcion: string = "",
		plazoDias: number = 0,
		porcentajeHonorarios: number = 0,
		fechaBaja: Date = null,
		nivel: number = 0,
		orden: number = 0
	)
	{
        this.id = id;
		this.idTipoActoProcesal = idTipoActoProcesal;
		this.codigoActoProcesal = codigoActoProcesal;
		this.descripcion = descripcion;
		this.plazoDias = plazoDias;
		this.porcentajeHonorarios = porcentajeHonorarios;
		this.fechaBaja = fechaBaja;
		this.nivel = nivel;
		this.orden = orden;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoActoProcesal = row.idTipoActoProcesal ?? 0;
		this.codigoActoProcesal = row.codigoActoProcesal ?? "";
		this.descripcion = row.descripcion ?? "";
		this.plazoDias = row.plazoDias ?? 0;
		this.porcentajeHonorarios = row.porcentajeHonorarios ?? 0;
		this.fechaBaja = row.fechaBaja ?? null;
		this.nivel = row.nivel ?? 0;
		this.orden = row.orden ?? 0;
	}

}
