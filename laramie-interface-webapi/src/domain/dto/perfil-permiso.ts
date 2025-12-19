import Perfil from "../entities/perfil";
import Permiso from "../entities/permiso";

export default class PerfilPermiso extends Perfil {

    permisos: Array<Permiso>;

    constructor(
        perfil: Perfil = new Perfil(),
        permisos: Array<Permiso> = [])
    {
        super(perfil.id, perfil.codigo, perfil.nombre)
        this.permisos = permisos;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.codigo = row.codigo ?? "";
        this.nombre = row.nombre ?? "";
        this.permisos = row.permisos ?? [];
    }
    
}
