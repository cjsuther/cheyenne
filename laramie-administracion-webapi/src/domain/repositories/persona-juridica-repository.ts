import PersonaFilter from "../dto/persona-filter";
import PersonaJuridica from "../entities/persona-juridica";

export default interface IPersonaJuridicaRepository {

	list();

	listByFilter(personaFilter: PersonaFilter);

	findById(id:number);

	add(row:PersonaJuridica);

	modify(id:number, row:PersonaJuridica);

	remove(id:number);

	bindRubrosAfip(id:number, rubrosAfip:number[]);

	unbindRubrosAfip(id:number, rubrosAfip:number[]);

	unbindAllRubrosAfip(id:number);

	onTransaction(request);

}
