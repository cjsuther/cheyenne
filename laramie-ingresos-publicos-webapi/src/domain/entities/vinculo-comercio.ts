import VinculoCuenta from "./vinculo-cuenta";
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';

export default class VinculoComercio extends VinculoCuenta {

	idComercio: number;
	idTipoVinculoComercio: number;

	constructor(
        id: number = 0,
		idComercio: number = 0,
		idTipoVinculoComercio: number = 0,
		idPersona: number = 0,
		idTipoPersona: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		nombrePersona: string = "",
		idTipoInstrumento: number = 0,
		fechaInstrumentoDesde: Date = null,
		fechaInstrumentoHasta: Date = null,
		porcentajeCondominio: number = 0
	)
	{
		super(id, TRIBUTO_TYPE.COMERCIOS, idComercio, idTipoVinculoComercio, idPersona, idTipoPersona, idTipoDocumento, numeroDocumento, nombrePersona, idTipoInstrumento, fechaInstrumentoDesde, fechaInstrumentoHasta, porcentajeCondominio);
		this.idComercio = idComercio;
		this.idTipoVinculoComercio = idTipoVinculoComercio;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoTributo = TRIBUTO_TYPE.COMERCIOS;
		this.idTributo = row.idComercio ?? 0;
		this.idComercio = row.idComercio ?? 0;
		this.idTipoVinculoCuenta = row.idTipoVinculoComercio ?? 0;
		this.idTipoVinculoComercio = row.idTipoVinculoComercio ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.nombrePersona = row.nombrePersona ?? "";
		this.idTipoInstrumento = row.idTipoInstrumento ?? 0;
		this.fechaInstrumentoDesde = row.fechaInstrumentoDesde ?? null;
		this.fechaInstrumentoHasta = row.fechaInstrumentoHasta ?? null;
		this.porcentajeCondominio = row.porcentajeCondominio ?? 0;
	}

}
