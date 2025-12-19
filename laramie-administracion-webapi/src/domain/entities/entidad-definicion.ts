
export default class EntidadDefinicion {

    id: number;
    tipo: string;
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

    constructor(
        id: number = 0,
        tipo: string = "",
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
        tipoDato1: string = "",
        tipoDato2: string = "",
        tipoDato3: string = "",
        tipoDato4: string = "",
        tipoDato5: string = "",
        tipoDato6: string = "",
        tipoDato7: string = "",
        tipoDato8: string = "",
        tipoDato9: string = "",
        tipoDato10: string = "")
    {
        this.id = id;
        this.tipo = tipo;
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
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.tipo = row.tipo ?? "";
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
    }
    
}
