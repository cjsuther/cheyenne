import Recaudacion from "../entities/recaudacion";
import RecaudacionLote from "../entities/recaudacion-lote";

export default class RecaudacionLoteDto {

    recaudacionLote: RecaudacionLote;
    recaudaciones: Recaudacion[];
	codigoRecaudadora: string;
    nombre: string = "";
    path: string = "";

    constructor(
        recaudacionLote: RecaudacionLote = null,
        recaudaciones: Recaudacion[] = [],
		codigoRecaudadora: string = "",
        nombre: string = "",
        path: string = ""

    ) {
        this.recaudacionLote = recaudacionLote;
        this.recaudaciones = recaudaciones;
		this.codigoRecaudadora = codigoRecaudadora;
        this.nombre = nombre;
        this.path = path;
    }
    
}
