import DeclaracionJurada from "../entities/declaracion-jurada";

export default interface IDeclaracionJuradaRepository {

	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:DeclaracionJurada);

	modify(id:number, row:DeclaracionJurada);

	remove(id:number);

}
