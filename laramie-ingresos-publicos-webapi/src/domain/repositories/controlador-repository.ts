import ControladorFilter from '../../domain/dto/controlador-filter';
import Controlador from "../entities/controlador";

export default interface IControladorRepository {

	list();

	listByFilter(controladorFilter: ControladorFilter);

	findById(id:number);

	add(row:Controlador);

	modify(id:number, row:Controlador);

	remove(id:number);

	onTransaction(request);

}
