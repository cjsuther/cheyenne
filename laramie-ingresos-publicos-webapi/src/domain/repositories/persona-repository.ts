import Persona from "../entities/persona";

export default interface IPersonaRepository {

	findById(id:number);

	add(row:Persona);

	modify(id:number, row:Persona);

	checkById(id:number, row:Persona);

}
