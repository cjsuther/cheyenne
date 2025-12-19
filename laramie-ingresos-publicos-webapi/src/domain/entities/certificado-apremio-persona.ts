export default class CertificadoApremioPersona {

    id: number;
	idCertificadoApremio: number;
	idTipoRelacionCertificadoApremioPersona: number;
	fechaDesde: Date;
	fechaHasta: Date;
	idPersona: number;
	idTipoPersona: number;
	nombrePersona: string;
	idTipoDocumento: number;
	numeroDocumento: string;

	constructor(
        id: number = 0,
		idCertificadoApremio: number = 0,
		idTipoRelacionCertificadoApremioPersona: number = 0,
		fechaDesde: Date = null,
		fechaHasta: Date = null,
		idPersona: number = 0,
		idTipoPersona: number = 0,
		nombrePersona: string = "",
		idTipoDocumento: number = 0,
		numeroDocumento: string = ""
	)
	{
        this.id = id;
		this.idCertificadoApremio = idCertificadoApremio;
		this.idTipoRelacionCertificadoApremioPersona = idTipoRelacionCertificadoApremioPersona;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.nombrePersona = nombrePersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCertificadoApremio = row.idCertificadoApremio ?? 0;
		this.idTipoRelacionCertificadoApremioPersona = row.idTipoRelacionCertificadoApremioPersona ?? 0;
		this.fechaDesde = row.fechaDesde ?? null;
		this.fechaHasta = row.fechaHasta ?? null;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.nombrePersona = row.nombrePersona ?? "";
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
	}

}
