import ConvenioParametro from "../entities/convenio-parametro";

export default interface IConvenioParametroRepository {

	list();

	findById(id:number);

	add(row:ConvenioParametro);

	modify(id:number, row:ConvenioParametro);

	remove(id:number);

}
