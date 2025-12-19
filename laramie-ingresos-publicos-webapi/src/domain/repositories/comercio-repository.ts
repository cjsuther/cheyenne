import Comercio from "../entities/comercio";
import ComercioFilter from '../dto/comercio-filter';


export default interface IComercioRepository {

    listByCuenta(comercioFilter: ComercioFilter);

    listByDatos(vehiculoFilter: ComercioFilter);

    findById(id:number);

    add(row:Comercio);

    modify(id:number, row:Comercio);

    remove(id:number);

    onTransaction(request);
    
}
