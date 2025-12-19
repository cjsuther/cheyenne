import { isEmpty } from "../../infraestructure/sdk/utils/validator";

export default class PersonaDTO {

	idTipoDocumento: number;
	numeroDocumento: string;
	nombre: string;
	apellido: string;

	idNacionalidad: number;
	idGenero: number;
	idEstadoCivil: number;
	fechaNacimiento: Date;

    direccionCodigoPostal: string;
    direccionCalle: string;
    direccionAltura: string;
    direccionPiso: string;
    direccionDpto: string;
    direccionIdPais: number;
    direccionIdProvincia: number;
    direccionIdLocalidad: number;

    contactoEmail: string;
    contactoCelular: string;

	constructor(
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		nombre: string = "",
		apellido: string = "",
		idNacionalidad: number = 0,
		idGenero: number = 0,
		idEstadoCivil: number = 0,
		fechaNacimiento: Date = null,
        direccionCodigoPostal = "",
        direccionCalle = "",
        direccionAltura = "",
        direccionPiso = "",
        direccionDpto = "",
        direccionIdPais = 0,
        direccionIdProvincia = 0,
        direccionIdLocalidad = 0,
        contactoEmail = "",
        contactoCelular = ""
	)
	{
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.nombre = nombre;
		this.apellido = apellido;
		this.idNacionalidad = idNacionalidad;
		this.idGenero = idGenero;
		this.idEstadoCivil = idEstadoCivil;
		this.fechaNacimiento = fechaNacimiento;
        this.direccionCodigoPostal = direccionCodigoPostal,
        this.direccionCalle = direccionCalle,
        this.direccionAltura = direccionAltura,
        this.direccionPiso = direccionPiso,
        this.direccionDpto = direccionDpto,
        this.direccionIdPais = direccionIdPais,
        this.direccionIdProvincia = direccionIdProvincia,
        this.direccionIdLocalidad = direccionIdLocalidad,
        this.contactoEmail = contactoEmail,
        this.contactoCelular = contactoCelular
	}

	setFromObject = (row) =>
	{
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.nombre = row.nombre ?? "";
		this.apellido = row.apellido ?? "";
		this.idNacionalidad = row.idNacionalidad ?? 0;
		this.idGenero = row.idGenero ?? 0;
		this.idEstadoCivil = row.idEstadoCivil ?? 0;
		this.fechaNacimiento = !isEmpty(row.fechaNacimiento) ? new Date(row.fechaNacimiento.toString()) : null;
        this.direccionCodigoPostal = row.direccionCodigoPostal ?? "";
        this.direccionCalle = row.direccionCalle ?? "";
        this.direccionAltura = row.direccionAltura ?? "";
        this.direccionPiso = row.direccionPiso ?? "";
        this.direccionDpto = row.direccionDpto ?? "";
        this.direccionIdPais = row.direccionIdPais ?? 0;
        this.direccionIdProvincia = row.direccionIdProvincia ?? 0;
        this.direccionIdLocalidad = row.direccionIdLocalidad ?? 0;
        this.contactoEmail = row.contactoEmail ?? "";
        this.contactoCelular = row.contactoCelular ?? "";
	}
    
}
