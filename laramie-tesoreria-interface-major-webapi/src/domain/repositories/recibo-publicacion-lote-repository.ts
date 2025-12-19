import ReciboPublicacionLote from "../entities/recibo-publicacion-lote";

export default interface IReciboPublicacionLoteRepository {

	listPendienteEnvio();

	findByLote(numeroLotePublicacion:string);

	add(row:ReciboPublicacionLote);

	modify(numeroLotePublicacion:string, fechaEnvio:Date, fechaConfirmacion:Date, observacionEnvio:string, observacionConfirmacion:string);

	modifyEnvio(numeroLotePublicacion:string, fechaEnvio:Date, observacionEnvio:string);

	modifyConfirmacion(numeroLotePublicacion:string, fechaConfirmacion:Date, observacionConfirmacion:string);

	modifyError(numeroLotePublicacion:string, observacion:string);

}
