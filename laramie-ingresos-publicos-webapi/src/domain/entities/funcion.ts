import FuncionParametro from "./funcion-parametro";

export default class Funcion {

    id: number;
	idCategoriaFuncion: number;
	codigo: string;
	nombre: string;
	descripcion: string;
	tipoDato: string;
	modulo: string;
	funcionParametros: Array<FuncionParametro>;

	constructor(
        id: number = 0,
		idCategoriaFuncion: number = 0,
		codigo: string = "",
		nombre: string = "",
		descripcion: string = "",
		tipoDato: string = "",
		modulo: string = "",
		funcionParametros: Array<FuncionParametro> = []
	)
	{
        this.id = id;
		this.idCategoriaFuncion = idCategoriaFuncion;
		this.codigo = codigo;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.tipoDato = tipoDato;
		this.modulo = modulo;
		this.funcionParametros = funcionParametros;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idCategoriaFuncion = row.idCategoriaFuncion ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.descripcion = row.descripcion ?? "";
		this.tipoDato = row.tipoDato ?? "";
		this.modulo = row.modulo ?? "";
		this.funcionParametros = row.funcionParametros.map(x => {
            let item = new FuncionParametro();
            item.setFromObject(x);
            return item;
        });
	}

}
