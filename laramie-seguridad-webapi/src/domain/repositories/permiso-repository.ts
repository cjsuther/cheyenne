export default interface IPermisoRepository {

    list();

    listByPerfil(idPerfil:number);

    listByUsuario(idUsuario:number);

    findById(id:number)
    
}
