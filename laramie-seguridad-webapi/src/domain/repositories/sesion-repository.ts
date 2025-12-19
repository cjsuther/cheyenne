import sesion from "../entities/sesion";

export default interface ISesionRepository {

	findByToken(token:string);

	add(row:sesion);

	modify(id:number, row:sesion);
}
