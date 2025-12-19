import Direccion from "../entities/direccion";

export default interface IDireccionRepository {

    list();

    listByEntidad(entidad:string, idEntidad:number);

    findById(id:number);

    findByEntidad(entidad:string, idEntidad:number);

    add(row:Direccion);

    modify(id:number, row:Direccion);

    remove(id:number);
    
    removeByEntidad(entidad:string, idEntidad: number);

}
