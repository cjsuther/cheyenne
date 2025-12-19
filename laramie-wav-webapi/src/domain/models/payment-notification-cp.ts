import { isNull } from "../../infraestructure/sdk/utils/validator";
import { PaymentNotificationCPInfoPagador } from "./payment-notification-cp-info-pagador";
import { PaymentNotificationCPProductoTransaccion } from "./payment-notification-cp-producto-transaccion";
import { PaymentNotificationCPResultado } from "./payment-notification-cp-resultado";

export class PaymentNotificationCP {
  transaccionComercioId: string;
  transaccionPlataformaId: string;
  tipo: string;
  monto: string;
  estado: string;
  detalle: string;
  metodoPago: Date;
  medioPago: string;
  estadoId: string;
  cuotas: string;
  informacionAdicional: string;
  marcaTarjeta: string;
  fechaTransaccion: string;
  fechaPago: string;
  informacionAdicionalLink: string;
  productoTransaccion: PaymentNotificationCPProductoTransaccion[];
  resultado: PaymentNotificationCPResultado;
  informacionPagador: PaymentNotificationCPInfoPagador;

  setFromRequest(row) {
    this.transaccionComercioId = row.TransaccionComercioId ?? "";
    this.transaccionPlataformaId = row.TransaccionPlataformaId ?? "";
    this.tipo = row.Tipo ?? "";
    this.monto = row.Monto ?? "";
    this.estado = row.Estado ?? "";
    this.estadoId = row.EstadoId ?? "";
    this.detalle = row.Detalle ?? "";
    this.medioPago = row.MedioPago ?? "";
    this.metodoPago = row.MetodoPago ?? "";
    this.cuotas = row.Cuotas ?? "";
    this.marcaTarjeta = row.MarcaTarjeta ?? "";
    this.fechaTransaccion = row.FechaTransaccion ?? "";
    this.fechaPago = row.FechaPago ?? "";
    this.informacionAdicional = row.InformacionAdicional ?? "";
    this.informacionAdicionalLink = row.InformacionAdicionalLink ?? "";

    this.resultado = new PaymentNotificationCPResultado();
    if (row.Resultado != null) {
      this.resultado.codigoInterno = row.Resultado.CodigoInterno ?? "";
      this.resultado.descripcion = row.Resultado.Descripcion ?? "";
    }
    this.informacionPagador = new PaymentNotificationCPInfoPagador();
    if (row.InformacionPagador != null) {
      this.informacionPagador.email = row.InformacionPagador.Email ?? "";
      this.informacionPagador.nombre = row.InformacionPagador.Nombre ?? "";
      this.informacionPagador.telefono = row.InformacionPagador.Telefono ?? "";
      this.informacionPagador.tipoDocumento =
        row.InformacionPagador.TipoDocumento ?? "";
      this.informacionPagador.numeroDocumento =
        row.InformacionPagador.NumeroDocumento ?? "";
    }
    this.productoTransaccion = [];
    if (row.ProductoTransaccion != null) {
      row.ProductoTransaccion.forEach((item) => {
        const productoTransaccion =
          new PaymentNotificationCPProductoTransaccion();
        productoTransaccion.nombreProducto = item.NombreProducto ?? "";
        productoTransaccion.monteProducto = item.MontoProducto ?? 0;
        this.productoTransaccion.push(productoTransaccion);
      });
    }
  }
}

/*
{
"TransaccionComercioId" :  "Prueba73523",
"TransaccionPlataformaId" :  "73523",
"Tipo" :  "PAGO",
"Monto" :  "1.00",
"Estado" :  "REALIZADA",
"Detalle" :  "Pago realizado exitosamente.",
"MetodoPago" :  null,
"MedioPago" :  "8",
"EstadoId" :  "2",
"Cuotas" :  "3",
"InformacionPagador" : {
},
"Resultado" : {
"CodigoInterno" :  "00",
"Descripcion" :  "(00)Pago exitoso"
},
"InformacionAdicional" :  "",
"MarcaTarjeta" :  "1",
"FechaTransaccion" :  "10/05/2020 15:15:40",
"FechaPago" :  "10/05/2020 16:00:00",
"InformacionAdicionalLink" :  null,
"ProductoTransaccion" :  null
}

*/
