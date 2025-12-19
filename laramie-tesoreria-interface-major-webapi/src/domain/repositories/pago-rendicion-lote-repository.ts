import PagoRendicionLote from "../entities/pago-rendicion-lote";

export default interface IPagoRendicionLoteRepository {

	listPendienteEnvio();

	findByLote(numeroLoteRendicion:string);

	add(row:PagoRendicionLote);

	modify(numeroLoteRendicion:string, fechaEnvio:Date, fechaConfirmacion:Date, observacionEnvio:string, observacionConfirmacion:string);

	modifyEnvio(numeroLoteRendicion:string, fechaEnvio:Date, observacionEnvio:string);

	modifyConfirmacion(numeroLoteRendicion:string, fechaConfirmacion:Date, observacionConfirmacion:string);

	modifyError(numeroLoteRendicion:string, observacion:string);
}
