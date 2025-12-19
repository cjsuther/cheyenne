import CertificadoApremioPersona from "../entities/certificado-apremio-persona";

export default class CertificadoApremioPersonaState extends CertificadoApremioPersona {

	state: string;

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
		numeroDocumento: string = "",
		state: string = "o"
	)
	{
        super(
			id, idCertificadoApremio, idTipoRelacionCertificadoApremioPersona, fechaDesde, fechaHasta, idPersona, 
			idTipoPersona, nombrePersona, idTipoDocumento, numeroDocumento
		);
		this.state = state;
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
		this.state = row.state ?? "o";
	}
}
