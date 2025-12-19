import RubroComercio from "../entities/rubro-comercio";

export default class RubroComercioState extends RubroComercio {

    state: string;

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
		idMotivoBajaRubroComercio: number = 0,
		state: string = "o"
	)
	{
		super(id, idComercio, idTipoRubroComercio, idUbicacionComercio, idRubroLiquidacion, idRubroProvincia,
			idRubroBCRA, descripcion, esDeOficio, esRubroPrincipal, esConDDJJ, fechaInicio, fechaCese,
			fechaAltaTransitoria, fechaBajaTransitoria, fechaBaja, idMotivoBajaRubroComercio);
			this.state = state;
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
		this.state = row.state ?? "o";
	}
}
