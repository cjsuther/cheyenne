import Verificacion from "../entities/verificacion";

export default interface IVerificacionRepository {

	listByInhumado(idObraInmueble:number);

	findById(id:number);

	add(row:Verificacion);

	modify(id:number, row:Verificacion);

	remove(id:number);

	removeByInhumado(idObraInmueble: number);

}
