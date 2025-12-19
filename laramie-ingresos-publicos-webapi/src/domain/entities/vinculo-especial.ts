import VinculoCuenta from "./vinculo-cuenta";
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';

export default class VinculoEspecial extends VinculoCuenta {

	idEspecial: number;
	idTipoVinculoEspecial: number;

	constructor(
        id: number = 0,
		idEspecial: number = 0,
		idTipoVinculoEspecial: number = 0,
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
		super(id, TRIBUTO_TYPE.CUENTAS_ESPECIALES, idEspecial, idTipoVinculoEspecial, idPersona, idTipoPersona, idTipoDocumento, numeroDocumento, nombrePersona, idTipoInstrumento, fechaInstrumentoDesde, fechaInstrumentoHasta, porcentajeCondominio);
		this.idEspecial = idEspecial;
		this.idTipoVinculoEspecial = idTipoVinculoEspecial;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoTributo = TRIBUTO_TYPE.CUENTAS_ESPECIALES;
		this.idTributo = row.idEspecial ?? 0;
		this.idEspecial = row.idEspecial ?? 0;
		this.idTipoVinculoCuenta = row.idTipoVinculoEspecial ?? 0;
		this.idTipoVinculoEspecial = row.idTipoVinculoEspecial ?? 0;
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
