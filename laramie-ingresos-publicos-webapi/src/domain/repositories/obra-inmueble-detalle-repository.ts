import ObraInmuebleDetalle from "../entities/obra-inmueble-detalle";

export default interface IObraInmuebleDetalleRepository {

	listByObraInmueble(idObraInmueble:number);

	findById(id:number);

	add(row:ObraInmuebleDetalle);

	modify(id:number, row:ObraInmuebleDetalle);

	remove(id:number);

	removeByObraInmueble(idObraInmueble: number);

}
