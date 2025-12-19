import Perfil from "../entities/perfil";

export default interface IPerfilRepository {

    list();

    listByUsuario(idUsuario:number);

    findById(id:number);

    add(row:Perfil);

    modify(id:number, row:Perfil);

    remove(id:number);


    bindPermisos(id:number, permisos:number[]);

    unbindPermisos(id:number, permisos:number[]);
    
}
