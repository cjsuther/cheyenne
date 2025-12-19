import MotivoBajaRubroComercio from "../entities/motivo-baja-rubro-comercio";

export default interface IMotivoBajaRubroComercioRepository {

	list();

	findById(id:number);

	add(row:MotivoBajaRubroComercio);

	modify(id:number, row:MotivoBajaRubroComercio);

	remove(id:number);

}
