import MotivoBajaComercio from "../entities/motivo-baja-comercio";

export default interface IMotivoBajaComercioRepository {

	list();

	findById(id:number);

	add(row:MotivoBajaComercio);

	modify(id:number, row:MotivoBajaComercio);

	remove(id:number);

}
