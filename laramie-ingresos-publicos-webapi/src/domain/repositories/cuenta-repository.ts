import CuentaFilter from "../dto/cuenta-filter";
import Cuenta from "../entities/cuenta";

export default interface ICuentaRepository {

    list();

    listByFilter(cuentaFilter:CuentaFilter);

    listByContribuyente(idContribuyente:number);

    listByPersona(idPersona:number);

    listByTipoTributo(idTipoTributo:number);

    listByCalculo(idEmisionEjecucion: number);

    listByOrdenamiento(idEmisionEjecucion: number);

    findById(id:number);

    findByNumeroCuenta(numeroCuenta:string);

    add(row:Cuenta);

    modify(id:number, row:Cuenta);

    remove(id:number);
    

    checkContribuyente(id:number, idContribuyente:number);

    bindContribuyentes(id:number, contribuyentes:number[]);

    unbindContribuyentes(id:number, contribuyentes:number[]);

    unbindAllContribuyentes(id:number);

}
