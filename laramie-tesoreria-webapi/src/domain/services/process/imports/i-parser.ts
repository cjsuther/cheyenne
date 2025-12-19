import Recaudadora from "../../../entities/recaudadora";

export default interface IParser {

    execute(idUsuario:number, nombre:string, content:string, municipioCodigo:string, recaudadora:Recaudadora);

}