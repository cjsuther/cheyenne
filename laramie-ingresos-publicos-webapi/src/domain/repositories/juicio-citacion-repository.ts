import JuicioCitacion from "../entities/juicio-citacion";

export default interface IJuicioCitacionRepository {

	listByApremio(idApremio: number);

	findById(id:number);

	add(row:JuicioCitacion);

	modify(id:number, row:JuicioCitacion);

	remove(id:number);

	removeByApremio(idApremio: number);

}

