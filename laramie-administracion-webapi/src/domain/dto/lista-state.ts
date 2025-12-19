import Lista from "../entities/lista";

export default class ListaState extends Lista {

    state: string;

    constructor(
        id: number = 0,
        codigo: string = "",
        tipo: string = "",
        nombre: string = "",
        orden: number = 0,
		state: string = "o")
    {
        super(id, codigo, tipo, nombre, orden);
		this.state = state;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.codigo = row.codigo ?? "";
        this.tipo = row.tipo ?? "";
        this.nombre = row.nombre ?? "";
        this.orden = row.orden ?? 0;
        this.state = row.state ?? "o";
    }
    
}
