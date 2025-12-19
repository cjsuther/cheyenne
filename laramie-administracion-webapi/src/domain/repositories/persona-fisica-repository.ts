import PersonaFilter from "../dto/persona-filter";
import PersonaFisica from "../entities/persona-fisica";

export default interface IPersonaFisicaRepository {

	list();

	listByFilter(personaFilter: PersonaFilter);

	findById(id:number);

	add(row:PersonaFisica);

	modify(id:number, row:PersonaFisica);

	remove(id:number);

	onTransaction(request);

}
