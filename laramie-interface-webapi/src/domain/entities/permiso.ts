export default class Permiso {

    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    sistema: string;
    idModulo: number;

    constructor(
        id: number = 0,
        codigo: string = "",
        nombre: string = "",
        descripcion: string = "",
        sistema: string = "",
        idModulo: number = 0)
    {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.sistema = sistema;
        this.idModulo = idModulo;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.codigo = row.codigo ?? "";
        this.nombre = row.nombre ?? "";
        this.descripcion = row.descripcion ?? "";
        this.sistema = row.sistema ?? "";
        this.idModulo = row.idModulo ?? "";
    }

}