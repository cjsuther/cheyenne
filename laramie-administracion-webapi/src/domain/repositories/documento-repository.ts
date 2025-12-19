import Documento from "../entities/documento";

export default interface IDocumentoRepository {

	list();
	
	listByPersona(idTipoPersona:number, idPersona:number) 

	findById(id:number);

	add(row:Documento);

	modify(id:number, row:Documento);

	remove(id:number);

	removeByPersona(idTipoPersona:number, idPersona:number);

}
