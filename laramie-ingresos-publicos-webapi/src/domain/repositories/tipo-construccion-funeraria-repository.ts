import TipoConstruccionFuneraria from "../entities/tipo-construccion-funeraria";

export default interface ITipoConstruccionFunerariaRepository {

	list();

	findById(id:number);

	add(row:TipoConstruccionFuneraria);

	modify(id:number, row:TipoConstruccionFuneraria);

	remove(id:number);

}
