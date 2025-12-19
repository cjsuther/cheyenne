import CuotaPorcentaje from "../entities/cuota-porcentaje";

export default interface ICuotaPorcentajeRepository {

	list();

	listByEmisionEjecucionCuenta(idEmisionEjecucion:number, idCuenta:number);

	findById(id:number);

	add(row:CuotaPorcentaje);

	addByBloque(rows: Array<CuotaPorcentaje>);

	modify(id:number, row:CuotaPorcentaje);

	remove(id:number);

}
