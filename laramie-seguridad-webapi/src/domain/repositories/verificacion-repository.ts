import Verificacion from "../entities/verificacion";

export default interface IVerificacionRepository {

	list();

	findById(id:number);

	findByToken(token:string);

	add(row:Verificacion);

	modify(id:number, row:Verificacion);

	remove(id:number);

}
