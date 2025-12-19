import ZonaEntrega from "../entities/zona-entrega";

export default interface IZonaEntregaRepository {

	listByCuenta(idCuenta: number);
	
	findById(id:number);

	add(row:ZonaEntrega);

	modify(id:number, row:ZonaEntrega);

	remove(id:number);

}
