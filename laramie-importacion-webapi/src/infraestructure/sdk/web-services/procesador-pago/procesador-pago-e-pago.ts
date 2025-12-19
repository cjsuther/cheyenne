import moment from 'moment';
import config from "../../../../server/configuration/config";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { SendRequestFormData } from "../../utils/request";
import * as soap from "soap";
import { PaymentData } from "../../../../domain/dto/models/payment-data";
import { isValidArray } from '../../utils/validator';

export default class ProcesadorPagoEPago {
  TOKEN_URL: string;
  SOLICITUD_URL: string;
  API_WSDL_URL: string;
  LOCAL_CHECKOUT_URL: string;
  ID_USUARIO: string;
  ID_ORGANISMO: string;
  PASSWORD: string;
  HASH: string;
  NRO_CONVENIO: string;

  constructor() {
    this.TOKEN_URL = config.PASARELA_PAGO.E_PAGO.TOKEN_URL;
    this.SOLICITUD_URL = config.PASARELA_PAGO.E_PAGO.SOLICITUD_URL;
    this.API_WSDL_URL = config.PASARELA_PAGO.E_PAGO.API_WSDL_URL;
    this.LOCAL_CHECKOUT_URL = config.PASARELA_PAGO.E_PAGO.LOCAL_CHECKOUT_URL;
    this.ID_USUARIO = config.PASARELA_PAGO.E_PAGO.ID_USUARIO;
    this.ID_ORGANISMO = config.PASARELA_PAGO.E_PAGO.ID_ORGANISMO;
    this.NRO_CONVENIO = config.PASARELA_PAGO.E_PAGO.NRO_CONVENIO;
    this.PASSWORD = config.PASARELA_PAGO.E_PAGO.PASSWORD;
    this.HASH = config.PASARELA_PAGO.E_PAGO.HASH;
  }

  async getSession() {
    const dataBody = {
      id_usuario: this.ID_USUARIO,
      id_organismo: this.ID_ORGANISMO,
      password: this.PASSWORD,
      hash: this.HASH,
    };
    const url = this.TOKEN_URL;

    return SendRequestFormData(null, null, dataBody, REQUEST_METHOD.POST, url)
      .then((response: any) => {
        if (response.id_resp == "01001") {
          return response.token;
        }
        console.info("EPago internal error session data:", response.id_resp);
        return "";
      })
      .catch((error) => {
        console.info("EPago error token data:", error);
        return "";
      });
  }

  async getPayments(dateFrom: Date, dateTo: Date) {
    try {
      const token = (await this.getSession()) as any;
      const client = await soap.createClientAsync(this.API_WSDL_URL);


      const args_obtener_rendiciones = {
        version: "2.0",
        credenciales: {
          id_organismo: this.ID_ORGANISMO,
          token: token,
        },
        rendicion: {
            Fecha_desde: this.getDateEPagos(dateFrom),
            Fecha_hasta: this.getDateEPagos(dateTo),
        },
      };

      const [result_obtener_rendiciones] = await client.obtener_rendicionesAsync(args_obtener_rendiciones);
      if (result_obtener_rendiciones.id_resp.$value !== 5001) {
        throw new Error(`${result_obtener_rendiciones.id_resp.$value} - No se pudo obtener la rendición.: ${result_obtener_rendiciones.respuesta.$value}`);
      }

      const operaciones:number[] = [];
      const rendiciones = isValidArray(result_obtener_rendiciones.rendicion.item) ? result_obtener_rendiciones.rendicion.item as any[] : [result_obtener_rendiciones.rendicion.item] as any[];
      if (rendiciones) {
        rendiciones.forEach(rendicion => {
          if (rendicion) {
            const detalles = isValidArray(rendicion.Detalles.item) ? rendicion.Detalles.item as any[] : [rendicion.Detalles.item] as any[];
            if (detalles) {
              detalles.forEach(detalle => {
                if (detalle) {
                  const operacion = detalle.Codigo_unico_transaccion.$value;
                  if (operacion) operaciones.push(operacion);
                }
              });
            }
          }
        });
      }

      const paymentsData:PaymentData[] = [];
      const args_obtener_pagos = {
        version: "2.0",
        credenciales: {
          id_organismo: this.ID_ORGANISMO,
          token: token,
        },
        pago: {
          CodigoUnicoTransaccion: 0
        },
      };
      for (let i=0; i<operaciones.length; i++) {
        args_obtener_pagos.pago.CodigoUnicoTransaccion = operaciones[i];

        const [result_obtener_pagos] = await client.obtener_pagosAsync(args_obtener_pagos);
        if (result_obtener_pagos.id_resp.$value !== 4001) {
          throw new Error(`${result_obtener_pagos.id_resp.$value} - No se pudo obtener los pagos.: ${result_obtener_pagos.respuesta.$value}`);
        }
        if (result_obtener_pagos.cantidadTotal.$value > 0) {
          const pagos = result_obtener_pagos.cantidadTotal.$value === 1 ? [result_obtener_pagos.pago.item] : result_obtener_pagos.pago.item;
          pagos.forEach(pago => {
            const partsExterna_3 = (pago.Externa_3.$value) ? pago.Externa_3.$value.split('|') : [];
            const paymentData: PaymentData = {
              id: pago.CodigoUnicoTransaccion.$value,
              status: pago.Estado.$value === "A",
              externalId: pago.Externa.$value,
              transactionAmount: pago.Importe.$value,
              createDate: pago.FechaPago.$value,
              data: (partsExterna_3.length > 1) ? {
                SUATS: true,
                numeroPartida: parseInt(partsExterna_3[1].toString())
              } : {
                SUATS: false,
                numeroPartida: null
              }
            };
            // if (paymentData.status) paymentsData.push(paymentData);

            //TEST SUATS
            // if (i===0) {
            //   paymentData.data.SUATS = true;
            //   paymentData.data.numeroPartida = 1116231
            // }

            paymentsData.push(paymentData);
          });
        }

      }

      return paymentsData;
    }
    catch (error) {
      throw new Error(`No se pudo obtener el pago: ${error.message}`);
    }
  }

  private getDateEPagos = (date) => {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
    else {
      return '';
    }
  }

}
