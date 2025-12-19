import TemaExpediente from "../entities/tema-expediente";

export default interface ITemaExpedienteRepository {

	list();

	findById(id:number);

	add(row:TemaExpediente);

	modify(id:number, row:TemaExpediente);

	remove(id:number);

}
