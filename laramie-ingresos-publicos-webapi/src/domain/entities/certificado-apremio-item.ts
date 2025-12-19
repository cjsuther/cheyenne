export default class CertificadoApremioItem {

    id: number;
	idCertificadoApremio: number;
	idCuentaCorrienteItem: number;
	idTasa: number;
	idSubTasa: number;
	periodo: string;
	cuota: number;
	monto: number;
	montoRecargo: number;
	montoTotal: number;

	constructor(
        id: number = 0,
		idCertificadoApremio: number = 0,
		idCuentaCorrienteItem: number = 0,
		idTasa: number = 0,
		idSubTasa: number = 0,
		periodo: string = "",
		cuota: number = 0,
		monto: number = 0,
		montoRecargo: number = 0,
		montoTotal: number = 0
	)
	{
        this.id = id;
		this.idCertificadoApremio = idCertificadoApremio;
		this.idCuentaCorrienteItem = idCuentaCorrienteItem;
		this.idTasa = idTasa;
		this.idSubTasa = idSubTasa;
		this.periodo = periodo;
		this.cuota = cuota;
		this.monto = monto;
		this.montoRecargo = montoRecargo;
		this.montoTotal = montoTotal;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCertificadoApremio = row.idCertificadoApremio ?? 0;
		this.idCuentaCorrienteItem = row.idCuentaCorrienteItem ?? 0;
		this.idTasa = row.idTasa ?? 0;
		this.idSubTasa = row.idSubTasa ?? 0;
		this.periodo = row.periodo ?? "";
		this.cuota = row.cuota ?? 0;
		this.monto = row.monto ?? 0;
		this.montoRecargo = row.montoRecargo ?? 0;
		this.montoTotal = row.montoTotal ?? 0;
	}

}
