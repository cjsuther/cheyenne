import Lista from "../entities/lista";

export default interface IListaRepository {

    list();
    
    listTipo(tipo:string);

    findById(id:number);

	add(row:Lista);

	modify(id:number, row:Lista);

	remove(id:number);
    
}
