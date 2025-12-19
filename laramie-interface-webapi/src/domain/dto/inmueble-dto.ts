import Cuenta from "../entities/cuenta";
import Inmueble from "../entities/inmueble";
import ObraInmuebleState from "./obra-inmueble-state";
import RelacionCuentaState from "./relacion-cuenta-state";



export default class InmuebleDTO {

    inmueble?: Inmueble;
    cuenta?: Cuenta;
    relacionesCuentas: RelacionCuentaState[];

    archivos: [];
    observaciones: [];
    etiquetas: [];

    variablesCuenta: [];
    vinculosInmueble: [];
    ladosTerreno: [];
    zonasEntrega: [];
    controladoresCuentas: [];
    valuaciones: [];
    obrasInmueble: ObraInmuebleState[];
    condicionesEspeciales: [];
    superficies: [];
    edesur: [];
    recargosDescuentos: [];
    debitosAutomaticos: [];

    constructor(
        inmueble: Inmueble = new Inmueble(),
        cuenta: Cuenta =  new Cuenta(),
        relacionesCuentas: RelacionCuentaState[] = [],
        obrasInmueble: ObraInmuebleState[] = []
    )
    {
        this.inmueble = inmueble;
        this.cuenta = cuenta;
        this.relacionesCuentas = relacionesCuentas;
        this.obrasInmueble = obrasInmueble;
        this.archivos = [];
        this.observaciones = [];
        this.etiquetas = [];
        this.variablesCuenta = [];
        this.vinculosInmueble = [];
        this.ladosTerreno = [];
        this.zonasEntrega = [];
        this.controladoresCuentas = [];
        this.valuaciones = [];
        this.condicionesEspeciales = [];
        this.superficies = [];
        this.edesur = [];
        this.recargosDescuentos = [];
        this.debitosAutomaticos = [];
    }

    setFromObject = (row) =>
    {
        this.inmueble.setFromObject(row.inmueble);
        this.cuenta.setFromObject(row.cuenta);
        this.relacionesCuentas = row.relacionesCuentas.map(x => {
            let item = new RelacionCuentaState();
            item.setFromObject(x);
            return item;
        });
        this.obrasInmueble = row.obrasInmueble.map(x => {
            let item = new ObraInmuebleState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
