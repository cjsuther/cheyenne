export default class Expediente {

    id: number;
	matricula: string;
	ejercicio: string;
	numero: string;
	letra: string;
	idProvincia: number;
	idTipoExpediente: number;
	subnumero: string;
	idTemaExpediente: number;
	referenciaExpediente: string;
	fechaCreacion: Date;

	constructor(
        id: number = 0,
		matricula: string = "",
		ejercicio: string = "",
		numero: string = "",
		letra: string = "",
		idProvincia: number = 0,
		idTipoExpediente: number = 0,
		subnumero: string = "",
		idTemaExpediente: number = 0,
		referenciaExpediente: string = "",
		fechaCreacion: Date = null
	)
	{
        this.id = id;
		this.matricula = matricula;
		this.ejercicio = ejercicio;
		this.numero = numero;
		this.letra = letra;
		this.idProvincia = idProvincia;
		this.idTipoExpediente = idTipoExpediente;
		this.subnumero = subnumero;
		this.idTemaExpediente = idTemaExpediente;
		this.referenciaExpediente = referenciaExpediente;
		this.fechaCreacion = fechaCreacion;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.matricula = row.matricula ?? "";
		this.ejercicio = row.ejercicio ?? "";
		this.numero = row.numero ?? "";
		this.letra = row.letra ?? "";
		this.idProvincia = row.idProvincia ?? 0;
		this.idTipoExpediente = row.idTipoExpediente ?? 0;
		this.subnumero = row.subnumero ?? "";
		this.idTemaExpediente = row.idTemaExpediente ?? 0;
		this.referenciaExpediente = row.referenciaExpediente ?? "";
		this.fechaCreacion = row.fechaCreacion ?? null;
	}

}
