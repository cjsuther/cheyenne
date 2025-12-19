import Usuario from "../entities/usuario";

export default interface IUsuarioRepository {

    list();

    findById(id:number);

    findByLogin(login: string);

    add(row:Usuario);

    modify(id:number, row:Usuario);

    remove(id:number);


    bindPerfiles(id:number, perfiles:number[]);

    unbindPerfiles(id:number, perfiles:number[]);

    findByIds(ids:number[]);
    
}
