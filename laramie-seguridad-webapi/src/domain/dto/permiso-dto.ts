import Permiso from "../entities/permiso";

export default class PermisoDto extends Permiso {

    selected: boolean;

    constructor(
        permiso: Permiso = new Permiso(),
        selected: boolean = false)
    {
        super(permiso.id, permiso.codigo, permiso.nombre, permiso.descripcion, permiso.sistema, permiso.idModulo)
        this.selected = selected;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.codigo = row.codigo ?? "";
        this.nombre = row.nombre ?? "";
        this.descripcion = row.descripcion ?? "";
        this.sistema = row.sistema ?? "";
        this.idModulo = row.idModulo ?? "";
        this.selected = row.selected ?? false;
    }
    
}