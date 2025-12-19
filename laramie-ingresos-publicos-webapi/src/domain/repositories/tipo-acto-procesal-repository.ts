import TipoActoProcesal from "../entities/tipo-acto-procesal";

export default interface ITipoActoProcesalRepository {

	list();

	findById(id:number);

	add(row:TipoActoProcesal);

	modify(id:number, row:TipoActoProcesal);

	remove(id:number);


	checkPlantillaDocumento(id:number, idPlantillaDocumento:number);

	bindPlantillasDocumentos(id:number, plantillasDocumentos:number[]);

	unbindPlantillasDocumentos(id:number, plantillasDocumentos:number[]);

	unbindAllPlantillasDocumentos(id:number);

}
