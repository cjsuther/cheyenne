import Contribuyente from "../entities/contribuyente";

export default interface IContribuyenteRepository {

	list();

	listByCuenta(idCuenta:number);

	findById(id:number);

	findByPersona(idPersona:number);

	add(row:Contribuyente);

	modify(id:number, row:Contribuyente);

	remove(id:number);

}
