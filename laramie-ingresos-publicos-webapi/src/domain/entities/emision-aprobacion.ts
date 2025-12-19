export default class EmisionAprobacion {

    id: number;
	idEmisionEjecucion: number;
	idEstadoAprobacionCalculo: number;
	idUsuarioAprobacionCalculo: number;
	fechaAprobacionCalculo: Date;
	idEstadoAprobacionOrdenamiento: number;
	idUsuarioAprobacionOrdenamiento: number;
	fechaAprobacionOrdenamiento: Date;
	idEstadoAprobacionControlRecibos: number;
	idUsuarioAprobacionControlRecibos: number;
	fechaAprobacionControlRecibos: Date;
	idEstadoAprobacionCodigoBarras: number;
	idUsuarioAprobacionCodigoBarras: number;
	fechaAprobacionCodigoBarras: Date;
	idEstadoProcesoCuentaCorriente: number;
	idUsuarioProcesoCuentaCorriente: number;
	fechaProcesoCuentaCorriente: Date;
	idEstadoProcesoImpresion: number;
	idUsuarioProcesoImpresion: number;
	fechaProcesoImpresion: Date;

	constructor(
        id: number = 0,
		idEmisionEjecucion: number = 0,
		idEstadoAprobacionCalculo: number = 0,
		idUsuarioAprobacionCalculo: number = 0,
		fechaAprobacionCalculo: Date = null,
		idEstadoAprobacionOrdenamiento: number = 0,
		idUsuarioAprobacionOrdenamiento: number = 0,
		fechaAprobacionOrdenamiento: Date = null,
		idEstadoAprobacionControlRecibos: number = 0,
		idUsuarioAprobacionControlRecibos: number = 0,
		fechaAprobacionControlRecibos: Date = null,
		idEstadoAprobacionCodigoBarras: number = 0,
		idUsuarioAprobacionCodigoBarras: number = 0,
		fechaAprobacionCodigoBarras: Date = null,
		idEstadoProcesoCuentaCorriente: number = 0,
		idUsuarioProcesoCuentaCorriente: number = 0,
		fechaProcesoCuentaCorriente: Date = null,
		idEstadoProcesoImpresion: number = 0,
		idUsuarioProcesoImpresion: number = 0,
		fechaProcesoImpresion: Date = null
	)
	{
        this.id = id;
		this.idEmisionEjecucion = idEmisionEjecucion;
		this.idEstadoAprobacionCalculo = idEstadoAprobacionCalculo;
		this.idUsuarioAprobacionCalculo = idUsuarioAprobacionCalculo;
		this.fechaAprobacionCalculo = fechaAprobacionCalculo;
		this.idEstadoAprobacionOrdenamiento = idEstadoAprobacionOrdenamiento;
		this.idUsuarioAprobacionOrdenamiento = idUsuarioAprobacionOrdenamiento;
		this.fechaAprobacionOrdenamiento = fechaAprobacionOrdenamiento;
		this.idEstadoAprobacionControlRecibos = idEstadoAprobacionControlRecibos;
		this.idUsuarioAprobacionControlRecibos = idUsuarioAprobacionControlRecibos;
		this.fechaAprobacionControlRecibos = fechaAprobacionControlRecibos;
		this.idEstadoAprobacionCodigoBarras = idEstadoAprobacionCodigoBarras;
		this.idUsuarioAprobacionCodigoBarras = idUsuarioAprobacionCodigoBarras;
		this.fechaAprobacionCodigoBarras = fechaAprobacionCodigoBarras;
		this.idEstadoProcesoCuentaCorriente = idEstadoProcesoCuentaCorriente;
		this.idUsuarioProcesoCuentaCorriente = idUsuarioProcesoCuentaCorriente;
		this.fechaProcesoCuentaCorriente = fechaProcesoCuentaCorriente;
		this.idEstadoProcesoImpresion = idEstadoProcesoImpresion;
		this.idUsuarioProcesoImpresion = idUsuarioProcesoImpresion;
		this.fechaProcesoImpresion = fechaProcesoImpresion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idEmisionEjecucion = row.idEmisionEjecucion ?? 0;
		this.idEstadoAprobacionCalculo = row.idEstadoAprobacionCalculo ?? 0;
		this.idUsuarioAprobacionCalculo = row.idUsuarioAprobacionCalculo ?? 0;
		this.fechaAprobacionCalculo = row.fechaAprobacionCalculo ?? null;
		this.idEstadoAprobacionOrdenamiento = row.idEstadoAprobacionOrdenamiento ?? 0;
		this.idUsuarioAprobacionOrdenamiento = row.idUsuarioAprobacionOrdenamiento ?? 0;
		this.fechaAprobacionOrdenamiento = row.fechaAprobacionOrdenamiento ?? null;
		this.idEstadoAprobacionControlRecibos = row.idEstadoAprobacionControlRecibos ?? 0;
		this.idUsuarioAprobacionControlRecibos = row.idUsuarioAprobacionControlRecibos ?? 0;
		this.fechaAprobacionControlRecibos = row.fechaAprobacionControlRecibos ?? null;
		this.idEstadoAprobacionCodigoBarras = row.idEstadoAprobacionCodigoBarras ?? 0;
		this.idUsuarioAprobacionCodigoBarras = row.idUsuarioAprobacionCodigoBarras ?? 0;
		this.fechaAprobacionCodigoBarras = row.fechaAprobacionCodigoBarras ?? null;
		this.idEstadoProcesoCuentaCorriente = row.idEstadoProcesoCuentaCorriente ?? 0;
		this.idUsuarioProcesoCuentaCorriente = row.idUsuarioProcesoCuentaCorriente ?? 0;
		this.fechaProcesoCuentaCorriente = row.fechaProcesoCuentaCorriente ?? null;
		this.idEstadoProcesoImpresion = row.idEstadoProcesoImpresion ?? 0;
		this.idUsuarioProcesoImpresion = row.idUsuarioProcesoImpresion ?? 0;
		this.fechaProcesoImpresion = row.fechaProcesoImpresion ?? null;
	}

}
