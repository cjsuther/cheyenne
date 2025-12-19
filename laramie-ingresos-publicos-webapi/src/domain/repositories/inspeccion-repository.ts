import Inspeccion from "../entities/inspeccion";

export default interface IInspeccionRepository {

	listByComercio(idComercio: number);

	findById(id:number);

	add(row:Inspeccion);

	modify(id:number, row:Inspeccion);

	remove(id:number);

	removeByComercio(idComercio: number);

}
