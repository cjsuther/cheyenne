import Inhumado from "../entities/inhumado";

export default interface IInhumadoRepository {

	listByCementerio(idCementerio: number);

	findById(id:number);

	add(row:Inhumado);

	modify(id:number, row:Inhumado);

	remove(id:number);

}
