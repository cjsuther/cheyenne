import Proceso from "../entities/proceso";

export default interface IProcesoRepository {

	list();

	listByEntidad(entidad: string);

	listByEstadoProceso(idEstadoProceso: number);

	listReady();

	findById(id:number);

	findByIdentificador(identificador:string);

	add(row:Proceso);

	modify(id:number, row:Proceso);

	remove(id:number);

}
