import RubroLiquidacion from "../entities/rubro-liquidacion";

export default interface IRubroLiquidacionRepository {

	list();

	findById(id:number);

	add(row:RubroLiquidacion);

	modify(id:number, row:RubroLiquidacion);

	remove(id:number);

}
