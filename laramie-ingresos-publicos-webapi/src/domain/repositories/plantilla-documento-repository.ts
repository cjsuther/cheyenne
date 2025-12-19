import PlantillaDocumento from "../entities/plantilla-documento";

export default interface IPlantillaDocumentoRepository {

	list();

	listByTipoPlantillaDocumento(idTipoPlantillaDocumento: number);

	listByTipoActoProcesal(idTipoActoProcesal:number);

	findById(id:number);

	add(row:PlantillaDocumento);

	modify(id:number, row:PlantillaDocumento);

	remove(id:number);

}
