import Coleccion from "../entities/coleccion";
import ColeccionCampo from "../entities/coleccion-campo";
import ProcedimientoVariable from "../entities/procedimiento-variable";

export default class ColeccionData {

    coleccion: Coleccion = null;
    campos: Array<[ColeccionCampo, ProcedimientoVariable]> = [];

    constructor() {
        
    }

}