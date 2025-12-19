import Direccion from "../entities/direccion";
import LadoTerreno from "../entities/lado-terreno";
import LadoTerrenoObraState from "./lado-terreno-obra-state";
import LadoTerrenoServicioState from "./lado-terreno-servicio-state";

export default class LadoTerrenoState extends LadoTerreno {

	state: string;
	direccion: Direccion;
	ladosTerrenoServicio: Array<LadoTerrenoServicioState>;
	ladosTerrenoObra: Array<LadoTerrenoObraState>;

	constructor(
        id: number = 0,
		idInmueble: number = 0,
		idTipoLado: number = 0,
		numero: number = 0,
		metros: number = 0,
		reduccion: number = 0,
		state: string = "o",
		direccion: Direccion = null,
        ladosTerrenoServicio: Array<LadoTerrenoServicioState> = [],
		ladosTerrenoObra: Array<LadoTerrenoObraState> = []
	)
	{
        super(id, idInmueble, idTipoLado, numero, metros, reduccion);
		this.state = state;
		this.direccion = direccion;
		this.ladosTerrenoServicio = ladosTerrenoServicio;
		this.ladosTerrenoObra = ladosTerrenoObra;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idInmueble = row.idInmueble ?? 0;
		this.idTipoLado = row.idTipoLado ?? 0;
		this.numero = row.numero ?? 0;
		this.metros = row.metros ?? 0;
		this.reduccion = row.reduccion ?? 0;
		this.state = row.state ?? "o";
		this.direccion = new Direccion();
		this.direccion.setFromObject(row.direccion);
		this.ladosTerrenoServicio = row.ladosTerrenoServicio.map(x => {
            let item = new LadoTerrenoServicioState();
            item.setFromObject(x);
            return item;
        });
		this.ladosTerrenoObra = row.ladosTerrenoObra.map(x => {
            let item = new LadoTerrenoObraState();
            item.setFromObject(x);
            return item;
        });
	}

}
