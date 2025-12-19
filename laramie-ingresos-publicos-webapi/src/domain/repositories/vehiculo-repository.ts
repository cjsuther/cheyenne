import Vehiculo from "../entities/vehiculo";
import VehiculoFilter from '../dto/vehiculo-filter';


export default interface IVehiculoRepository {

    listByCuenta(vehiculoFilter: VehiculoFilter);

    listByDatos(vehiculoFilter: VehiculoFilter);
    
    findById(id:number);

    add(row:Vehiculo);

    modify(id:number, row:Vehiculo);

    remove(id:number);

    onTransaction(request);
    
}
