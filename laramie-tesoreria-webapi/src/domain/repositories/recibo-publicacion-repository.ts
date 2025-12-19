import ReciboPublicacion from "../entities/recibo-publicacion";

export default interface IReciboPublicacionRepository {

	list();

	listByNumeros(codigoDelegacion:string, numerosRecibo:number[]);

	findById(id:number);

	findByCuentaPago(idCuentaPago:number);

	findByNumero(codigoDelegacion: string, numeroRecibo: number);

	findByCodigoBarras(codigoBarras: string);

	add(row:ReciboPublicacion);

	modify(id:number, row:ReciboPublicacion);

	remove(id:number);

}
