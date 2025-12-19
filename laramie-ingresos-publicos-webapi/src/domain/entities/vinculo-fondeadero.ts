import VinculoCuenta from "./vinculo-cuenta";
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';

export default class VinculoFondeadero extends VinculoCuenta {

    idFondeadero: number;
	idTipoVinculoFondeadero: number;

	constructor(
        id: number = 0,
		idFondeadero: number = 0,
		idTipoVinculoFondeadero: number = 0,
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
		super(id, TRIBUTO_TYPE.FONDEADEROS, idFondeadero, idTipoVinculoFondeadero, idPersona, idTipoPersona, idTipoDocumento, numeroDocumento, nombrePersona, idTipoInstrumento, fechaInstrumentoDesde, fechaInstrumentoHasta, porcentajeCondominio);
		this.idFondeadero = idFondeadero;
		this.idTipoVinculoFondeadero = idTipoVinculoFondeadero;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoTributo = TRIBUTO_TYPE.FONDEADEROS;
		this.idTributo = row.idFondeadero ?? 0;
		this.idFondeadero = row.idFondeadero ?? 0;
		this.idTipoVinculoCuenta = row.idTipoVinculoFondeadero ?? 0;
		this.idTipoVinculoFondeadero = row.idTipoVinculoFondeadero ?? 0;
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
