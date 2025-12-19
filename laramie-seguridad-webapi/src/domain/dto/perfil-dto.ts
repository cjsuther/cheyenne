import Perfil from "../entities/perfil";

export default class PerfilDto extends Perfil {

    selected: boolean;

    constructor(
        perfil: Perfil = new Perfil(),
        selected: boolean = false)
    {
        super(perfil.id, perfil.codigo, perfil.nombre)
        this.selected = selected;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.codigo = row.codigo ?? "";
        this.nombre = row.nombre ?? "";
        this.selected = row.selected ?? false;
    }
    
}
