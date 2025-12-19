export default class CertificadoApremioFilter {

	idApremio: number;
	idCuenta: number;
	idEstadoCertificadoApremio: number;
	numero: string;
	fechaCertificadoDesde: Date;
	fechaCertificadoHasta: Date;

	constructor(
		idApremio: number = 0,
		idCuenta: number = 0,
		idEstadoCertificadoApremio: number = 0,
		numero: string = "",
		fechaCertificadoDesde: Date = null,
		fechaCertificadoHasta: Date = null,
	)
	{
		this.idApremio = idApremio;
		this.idCuenta = idCuenta;
		this.idEstadoCertificadoApremio = idEstadoCertificadoApremio;
		this.numero = numero;
		this.fechaCertificadoDesde = fechaCertificadoDesde;
		this.fechaCertificadoHasta = fechaCertificadoHasta;
	}

	setFromObject = (row) =>
	{
		this.idApremio = row.idApremio ?? 0;
		this.idCuenta = row.idCuenta ?? 0;
		this.idEstadoCertificadoApremio = row.idEstadoCertificadoApremio ?? 0;
		this.numero = row.numero ?? "";
		this.fechaCertificadoDesde = row.fechaCertificadoDesde ?? null;
		this.fechaCertificadoHasta = row.fechaCertificadoHasta ?? null;
	}

}
