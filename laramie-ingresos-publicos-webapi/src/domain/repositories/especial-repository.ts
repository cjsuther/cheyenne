import Especial from "../entities/especial";
import EspecialFilter from '../dto/especial-filter';


export default interface IEspecialRepository {

    listByCuenta(especialFilter: EspecialFilter);

    findById(id:number);

    add(row:Especial);

    modify(id:number, row:Especial);

    remove(id:number);

    onTransaction(request);
    
}
