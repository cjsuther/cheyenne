import Usuario from "../entities/usuario";

export default class UsuarioDTO extends Usuario {

    perfiles: number[];

    constructor(
        usuario: Usuario,
        perfiles: number[] = [])
    {
        super(usuario.id, usuario.idTipoUsuario, usuario.idEstadoUsuario, usuario.idPersona, usuario.codigo, usuario.nombreApellido, usuario.email, usuario.fechaAlta, usuario.fechaBaja);
        this.perfiles = perfiles;
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
        this.perfiles = row.perfiles ?? [];
    }
    
}
