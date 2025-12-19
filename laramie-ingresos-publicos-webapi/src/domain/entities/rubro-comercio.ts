export default class RubroComercio {

    id: number;
	idComercio: number;
	idTipoRubroComercio: number;
	idUbicacionComercio: number;
	idRubroLiquidacion: number;
	idRubroProvincia: number;
	idRubroBCRA: number;
	descripcion: string;
	esDeOficio: boolean;
	esRubroPrincipal: boolean;
	esConDDJJ: boolean;
	fechaInicio: Date;
	fechaCese: Date;
	fechaAltaTransitoria: Date;
	fechaBajaTransitoria: Date;
	fechaBaja: Date;
	idMotivoBajaRubroComercio: number;

	constructor(
        id: number = 0,
		idComercio: number = 0,
		idTipoRubroComercio: number = 0,
		idUbicacionComercio: number = 0,
		idRubroLiquidacion: number = 0,
		idRubroProvincia: number = 0,
		idRubroBCRA: number = 0,
		descripcion: string = "",
		esDeOficio: boolean = false,
		esRubroPrincipal: boolean = false,
		esConDDJJ: boolean = false,
		fechaInicio: Date = null,
		fechaCese: Date = null,
		fechaAltaTransitoria: Date = null,
		fechaBajaTransitoria: Date = null,
		fechaBaja: Date = null,
		idMotivoBajaRubroComercio: number = 0
	)
	{
        this.id = id;
		this.idComercio =  idComercio;
		this.idTipoRubroComercio =  idTipoRubroComercio;
		this.idUbicacionComercio =  idUbicacionComercio;
		this.idRubroLiquidacion =  idRubroLiquidacion;
		this.idRubroProvincia =  idRubroProvincia;
		this.idRubroBCRA =  idRubroBCRA;
		this.descripcion =  descripcion;
		this.esDeOficio =  esDeOficio;
		this.esRubroPrincipal =  esRubroPrincipal;
		this.esConDDJJ =  esConDDJJ;
		this.fechaInicio =  fechaInicio;
		this.fechaCese =  fechaCese;
		this.fechaAltaTransitoria =  fechaAltaTransitoria;
		this.fechaBajaTransitoria =  fechaBajaTransitoria;
		this.fechaBaja =  fechaBaja;
		this.idMotivoBajaRubroComercio =  idMotivoBajaRubroComercio;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idComercio = row.idComercio ?? 0;
		this.idTipoRubroComercio = row.idTipoRubroComercio ?? 0;
		this.idUbicacionComercio = row.idUbicacionComercio ?? 0;
		this.idRubroLiquidacion = row.idRubroLiquidacion ?? 0;
		this.idRubroProvincia = row.idRubroProvincia ?? 0;
		this.idRubroBCRA = row.idRubroBCRA ?? 0;
		this.descripcion = row.descripcion ?? "";
		this.esDeOficio = row.esDeOficio ?? false;
		this.esRubroPrincipal = row.esRubroPrincipal ?? false;
		this.esConDDJJ = row.esConDDJJ ?? false;
		this.fechaInicio = row.fechaInicio ?? null;
		this.fechaCese = row.fechaCese ?? null;
		this.fechaAltaTransitoria = row.fechaAltaTransitoria ?? null;
		this.fechaBajaTransitoria = row.fechaBajaTransitoria ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
		this.idMotivoBajaRubroComercio = row.idMotivoBajaRubroComercio ?? 0;
	}

}
