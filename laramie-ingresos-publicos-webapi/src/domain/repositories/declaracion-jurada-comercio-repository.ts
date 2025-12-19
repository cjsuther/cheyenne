import DeclaracionJuradaComercio from "../entities/declaracion-jurada-comercio";

export default interface IDeclaracionJuradaComercioRepository {

	list();
	
	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:DeclaracionJuradaComercio);

	modify(id:number, row:DeclaracionJuradaComercio);

	remove(id:number);

}
