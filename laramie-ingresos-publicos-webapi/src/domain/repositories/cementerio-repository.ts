import Cementerio from "../entities/cementerio";
import CementerioFilter from '../dto/cementerio-filter';


export default interface ICementerioRepository {

    listByCuenta(cementerioFilter: CementerioFilter);

    listByDatos(cementerioFilter: CementerioFilter);

    findById(id:number);

    add(row:Cementerio);

    modify(id:number, row:Cementerio);

    remove(id:number);

    onTransaction(request);
    
}
