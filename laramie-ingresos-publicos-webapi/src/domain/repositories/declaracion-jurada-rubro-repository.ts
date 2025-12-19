import DeclaracionJuradaRubro from "../entities/declaracion-jurada-rubro";

export default interface IDeclaracionJuradaRubroRepository {

	list();

	listByDeclaracionJuradaComercio(idDeclaracionJuradaComercio: number)

	findById(id:number);

	add(row:DeclaracionJuradaRubro);

	modify(id:number, row:DeclaracionJuradaRubro);

	remove(id:number);

}
