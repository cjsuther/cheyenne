import { isNull } from "../../infraestructure/sdk/utils/validator";

export class PaymentNotificationEP {
  idTransaccion: string;
  numeroOperacion: string;

  setFromRequest(row) {
    this.idTransaccion = row.id_transaccion ?? "";
    this.numeroOperacion = row.numero_operacion ?? "";
  }
}
