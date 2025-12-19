
export default class Usuario {

    id: number;
    idTipoUsuario: number;
    idEstadoUsuario: number;
    idPersona?: number;
    codigo: string;
    nombreApellido: string;
    email: string;
    fechaAlta: Date;
    fechaBaja: Date;

    constructor(
        id: number = 0,
        idTipoUsuario: number = 0,
        idEstadoUsuario: number = 0,
        idPersona: number = 0,
        codigo: string = "",
        nombreApellido: string = "",
        email: string = "",
        fechaAlta: Date = null,
        fechaBaja: Date = null)
    {
        this.id = id;
        this.idTipoUsuario = idTipoUsuario;
        this.idEstadoUsuario = idEstadoUsuario;
        this.idPersona = idPersona;
        this.codigo = codigo;
        this.nombreApellido = nombreApellido;
        this.email = email;
        this.fechaAlta = fechaAlta;
        this.fechaBaja = fechaBaja;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.idTipoUsuario = row.idTipoUsuario ?? 0;
        this.idEstadoUsuario = row.idEstadoUsuario ?? 0;
        this.idPersona = row.idPersona ?? 0;
        this.codigo = row.codigo ?? "";
        this.nombreApellido = row.nombreApellido ?? "";
        this.email = row.email ?? "";
        this.fechaAlta = row.fechaAlta ?? null;
        this.fechaBaja = row.fechaBaja ?? null;
    }
    
}
