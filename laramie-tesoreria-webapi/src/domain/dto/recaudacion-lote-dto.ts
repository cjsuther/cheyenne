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

    setFromObjectAddRecaudacionIngresosPublicos = (row) =>
    {
		this.codigoRecaudadora = row.codigoRecaudadora ?? "";
		this.nombre = row.nombre ?? "";
		this.path = row.path ?? "";

        if (!this.recaudacionLote) this.recaudacionLote = new RecaudacionLote();
        this.recaudacionLote.setFromObjectAddImportacion(row.recaudacionLote);

        this.recaudaciones = row.recaudaciones.map(x => {
            let item = new Recaudacion();
            item.setFromObjectAddImportacion(x);
            return item;
        });
    }
    
}
