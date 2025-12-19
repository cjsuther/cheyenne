import SubTasaImputacion from "../entities/sub-tasa-imputacion";

export default interface ISubTasaImputacionRepository {

	listBySubTasa(idSubTasa: number);

	findById(id:number);

	add(row:SubTasaImputacion);

	modify(id:number, row:SubTasaImputacion);

	remove(id:number);

	removeBySubTasa(idSubTasa: number);
}
