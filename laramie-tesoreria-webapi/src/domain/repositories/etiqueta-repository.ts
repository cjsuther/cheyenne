import Etiqueta from "../entities/etiqueta";

export default interface IEtiquetaRepository {

	list();

	listByEntidad(entidad:string, idEntidad:number);

	listByPersonaFisica(idPersonaFisica:number);

	listByPersonaJuridica(idPersonaJuridica:number);

	findById(id:number);

	add(row:Etiqueta);

	modify(id:number, row:Etiqueta);

	remove(id:number);

}
