import Inmueble from "../entities/inmueble";
import InmuebleFilter from '../dto/inmueble-filter';


export default interface IInmuebleRepository {

    listByCuenta(inmuebleFilter: InmuebleFilter);

    listByUbicacion(inmuebleFilter: InmuebleFilter);

    findById(id:number);

    findByCuenta(idCuenta:number);

    add(row:Inmueble);

    modify(id:number, row:Inmueble);

    remove(id:number);

    onTransaction(request);
    
}
