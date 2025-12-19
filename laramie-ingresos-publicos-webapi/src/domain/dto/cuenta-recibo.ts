import Cuenta from '../entities/cuenta';
import Contribuyente from '../entities/contribuyente';
import VariableCuenta from '../entities/variable-cuenta';
import ControladorCuenta from '../entities/controlador-cuenta';
import Controlador from '../entities/controlador';
import Direccion from '../entities/direccion';
import Valuacion from '../entities/valuacion';


export default class CuentaRecibo {

    cuenta?: Cuenta;
    contribuyentePrincipal?: Contribuyente;
    controlador?: Controlador;
    direccionPrincipal?: Direccion;
    direccionEntrega?: Direccion;
    partida: String;
    nomenclatura: String;

    valuaciones: Array<Valuacion>
    variablesCuenta: Array<VariableCuenta>;
    controladoresCuenta: Array<ControladorCuenta>;

    constructor(){
        this.cuenta = null;
        this.contribuyentePrincipal = null;
        this.controlador = null;
        this.direccionPrincipal = null;
        this.direccionEntrega = null;
        this.partida = "";
        this.nomenclatura = "";

        this.valuaciones = [];
        this.variablesCuenta = [];
        this.controladoresCuenta = [];
     }
    
}
