
export default class EntidadDefinicion {

    id: number;
    tipo: string;
    descripcion: string;
    nombre1: string;
    nombre2: string;
    nombre3: string;
    nombre4: string;
    nombre5: string;
    nombre6: string;
    nombre7: string;
    nombre8: string;
    nombre9: string;
    nombre10: string;
    descripcion1: string;
    descripcion2: string;
    descripcion3: string;
    descripcion4: string;
    descripcion5: string;
    descripcion6: string;
    descripcion7: string;
    descripcion8: string;
    descripcion9: string;
    descripcion10: string;
    tipoDato1: string;
    tipoDato2: string;
    tipoDato3: string;
    tipoDato4: string;
    tipoDato5: string;
    tipoDato6: string;
    tipoDato7: string;
    tipoDato8: string;
    tipoDato9: string;
    tipoDato10: string;
    obligatorio1: boolean;
    obligatorio2: boolean;
    obligatorio3: boolean;
    obligatorio4: boolean;
    obligatorio5: boolean;
    obligatorio6: boolean;
    obligatorio7: boolean;
    obligatorio8: boolean;
    obligatorio9: boolean;
    obligatorio10: boolean;

    constructor(
        id: number = 0,
        tipo: string = "",
        descripcion: string = "",
        nombre1: string = "",
        nombre2: string = "",
        nombre3: string = "",
        nombre4: string = "",
        nombre5: string = "",
        nombre6: string = "",
        nombre7: string = "",
        nombre8: string = "",
        nombre9: string = "",
        nombre10: string = "",
        descripcion1: string = "",
        descripcion2: string = "",
        descripcion3: string = "",
        descripcion4: string = "",
        descripcion5: string = "",
        descripcion6: string = "",
        descripcion7: string = "",
        descripcion8: string = "",
        descripcion9: string = "",
        descripcion10: string = "",
        tipoDato1: string = "",
        tipoDato2: string = "",
        tipoDato3: string = "",
        tipoDato4: string = "",
        tipoDato5: string = "",
        tipoDato6: string = "",
        tipoDato7: string = "",
        tipoDato8: string = "",
        tipoDato9: string = "",
        tipoDato10: string = "",
        obligatorio1: boolean = false,
        obligatorio2: boolean = false,
        obligatorio3: boolean = false,
        obligatorio4: boolean = false,
        obligatorio5: boolean = false,
        obligatorio6: boolean = false,
        obligatorio7: boolean = false,
        obligatorio8: boolean = false,
        obligatorio9: boolean = false,
        obligatorio10: boolean = false)
    {
        this.id = id;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.nombre1 = nombre1;
        this.nombre2 = nombre2;
        this.nombre3 = nombre3;
        this.nombre4 = nombre4;
        this.nombre5 = nombre5;
        this.nombre6 = nombre6;
        this.nombre7 = nombre7;
        this.nombre8 = nombre8;
        this.nombre9 = nombre9;
        this.nombre10 = nombre10;
        this.descripcion1 = descripcion1;
        this.descripcion2 = descripcion2;
        this.descripcion3 = descripcion3;
        this.descripcion4 = descripcion4;
        this.descripcion5 = descripcion5;
        this.descripcion6 = descripcion6;
        this.descripcion7 = descripcion7;
        this.descripcion8 = descripcion8;
        this.descripcion9 = descripcion9;
        this.descripcion10 = descripcion10;
        this.tipoDato1 = tipoDato1;
        this.tipoDato2 = tipoDato2;
        this.tipoDato3 = tipoDato3;
        this.tipoDato4 = tipoDato4;
        this.tipoDato5 = tipoDato5;
        this.tipoDato6 = tipoDato6;
        this.tipoDato7 = tipoDato7;
        this.tipoDato8 = tipoDato8;
        this.tipoDato9 = tipoDato9;
        this.tipoDato10 = tipoDato10;
        this.obligatorio1 = obligatorio1;
        this.obligatorio2 = obligatorio2;
        this.obligatorio3 = obligatorio3;
        this.obligatorio4 = obligatorio4;
        this.obligatorio5 = obligatorio5;
        this.obligatorio6 = obligatorio6;
        this.obligatorio7 = obligatorio7;
        this.obligatorio8 = obligatorio8;
        this.obligatorio9 = obligatorio9;
        this.obligatorio10 = obligatorio10;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.tipo = row.tipo ?? "";
        this.descripcion = row.descripcion ?? "";
        this.nombre1 = row.nombre1 ?? "";
        this.nombre2 = row.nombre2 ?? "";
        this.nombre3 = row.nombre3 ?? "";
        this.nombre4 = row.nombre4 ?? "";
        this.nombre5 = row.nombre5 ?? "";
        this.nombre6 = row.nombre6 ?? "";
        this.nombre7 = row.nombre7 ?? "";
        this.nombre8 = row.nombre8 ?? "";
        this.nombre9 = row.nombre9 ?? "";
        this.nombre10 = row.nombre10 ?? "";
        this.descripcion1 = row.descripcion1 ?? "";
        this.descripcion2 = row.descripcion2 ?? "";
        this.descripcion3 = row.descripcion3 ?? "";
        this.descripcion4 = row.descripcion4 ?? "";
        this.descripcion5 = row.descripcion5 ?? "";
        this.descripcion6 = row.descripcion6 ?? "";
        this.descripcion7 = row.descripcion7 ?? "";
        this.descripcion8 = row.descripcion8 ?? "";
        this.descripcion9 = row.descripcion9 ?? "";
        this.descripcion10 = row.descripcion10 ?? "";
        this.tipoDato1 = row.tipoDato1 ?? "";
        this.tipoDato2 = row.tipoDato2 ?? "";
        this.tipoDato3 = row.tipoDato3 ?? "";
        this.tipoDato4 = row.tipoDato4 ?? "";
        this.tipoDato5 = row.tipoDato5 ?? "";
        this.tipoDato6 = row.tipoDato6 ?? "";
        this.tipoDato7 = row.tipoDato7 ?? "";
        this.tipoDato8 = row.tipoDato8 ?? "";
        this.tipoDato9 = row.tipoDato9 ?? "";
        this.tipoDato10 = row.tipoDato10 ?? "";
        this.obligatorio1 = row.obligatorio1 ?? "";
        this.obligatorio2 = row.obligatorio2 ?? "";
        this.obligatorio3 = row.obligatorio3 ?? "";
        this.obligatorio4 = row.obligatorio4 ?? "";
        this.obligatorio5 = row.obligatorio5 ?? "";
        this.obligatorio6 = row.obligatorio6 ?? "";
        this.obligatorio7 = row.obligatorio7 ?? "";
        this.obligatorio8 = row.obligatorio8 ?? "";
        this.obligatorio9 = row.obligatorio9 ?? "";
        this.obligatorio10 = row.obligatorio10 ?? "";
    }
    
}
