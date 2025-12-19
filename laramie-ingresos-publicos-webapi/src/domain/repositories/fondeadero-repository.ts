import Fondeadero from "../entities/fondeadero";
import FondeaderoFilter from '../dto/fondeadero-filter';


export default interface IFondeaderoRepository {

    listByCuenta(fondeaderoFilter: FondeaderoFilter);

    listByDatos(fondeaderoFilter: FondeaderoFilter);

    findById(id:number);

    add(row:Fondeadero);

    modify(id:number, row:Fondeadero);

    remove(id:number);

    onTransaction(request);
    
}
