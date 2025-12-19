
export default class Entidad {

    id: number;
    codigo: string;
    tipo: string;
    nombre: string;
    orden: number;
    dato1: string;
    dato2: string;
    dato3: string;
    dato4: string;
    dato5: string;
    dato6: string;
    dato7: string;
    dato8: string;
    dato9: string;
    dato10: string;

    constructor(
        id: number = 0,
        codigo: string = "",
        tipo: string = "",
        nombre: string = "",
        orden: number = 0,
        dato1: string = "",
        dato2: string = "",
        dato3: string = "",
        dato4: string = "",
        dato5: string = "",
        dato6: string = "",
        dato7: string = "",
        dato8: string = "",
        dato9: string = "",
        dato10: string = "")
    {
        this.id = id;
        this.codigo = codigo;
        this.tipo = tipo;
        this.nombre = nombre;
        this.orden = orden;
        this.dato1 = dato1;
        this.dato2 = dato2;
        this.dato3 = dato3;
        this.dato4 = dato4;
        this.dato5 = dato5;
        this.dato6 = dato6;
        this.dato7 = dato7;
        this.dato8 = dato8;
        this.dato9 = dato9;
        this.dato10 = dato10;
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.codigo = row.codigo ?? "";
        this.tipo = row.tipo ?? "";
        this.nombre = row.nombre ?? "";
        this.orden = row.orden ?? 0;
        this.dato1 = row.dato1 ?? "";
        this.dato2 = row.dato2 ?? "";
        this.dato3 = row.dato3 ?? "";
        this.dato4 = row.dato4 ?? "";
        this.dato5 = row.dato5 ?? "";
        this.dato6 = row.dato6 ?? "";
        this.dato7 = row.dato7 ?? "";
        this.dato8 = row.dato8 ?? "";
        this.dato9 = row.dato9 ?? "";
        this.dato10 = row.dato10 ?? "";
    }
    
}
