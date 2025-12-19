import Observacion from "../entities/observacion";

export default interface IObservacionRepository {

	list();

	listByEntidad(entidad:string, idEntidad:number);

	listByPersonaFisica(idPersonaFisica:number);

	listByPersonaJuridica(idPersonaJuridica:number);

	findById(id:number);

	add(row:Observacion);

	modify(id:number, row:Observacion);

	remove(id:number);

}
