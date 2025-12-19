import axios from 'axios';
import { XMLParser } from "fast-xml-parser";

import config from "../../../../server/configuration/config";
import { PaymentData } from "../../../../domain/dto/models/payment-data";
import { getDateToString, getStringToDate } from '../../utils/convert';

export default class ProcesadorPagoInterbanking {
  BASE_URL: string;
  CODIGO_COMUNIDAD: string;
  USUARIO_NOMBRE: string;
  USUARIO_CLAVE: string;
  USUARIO_CUIL: string;   
  USUARIO_PAIS: string;

  constructor() {
    this.BASE_URL = config.PASARELA_PAGO.INTERBANKING.BASE_URL;
    this.CODIGO_COMUNIDAD = config.PASARELA_PAGO.INTERBANKING.CODIGO_COMUNIDAD;
    this.USUARIO_NOMBRE = config.PASARELA_PAGO.INTERBANKING.USUARIO_NOMBRE;
    this.USUARIO_CLAVE = config.PASARELA_PAGO.INTERBANKING.USUARIO_CLAVE;
    this.USUARIO_CUIL = config.PASARELA_PAGO.INTERBANKING.USUARIO_CUIL;
    this.USUARIO_PAIS = config.PASARELA_PAGO.INTERBANKING.USUARIO_PAIS;
  }

  async getPayments(dateFrom: Date, dateTo: Date) {
    try {
      const url = this.BASE_URL + "consultaComunidades.do";
      const fechaDesde = getDateToString(dateFrom);
      const fechaHasta = getDateToString(dateTo);

      const dataObj = {
        //datos de la comunidad
        comunidad: this.CODIGO_COMUNIDAD,
        //datos del usuario operador de sistema
        nombre_usuario: this.USUARIO_NOMBRE,
        clave: this.USUARIO_CLAVE,
        cuil: this.USUARIO_CUIL,
        pais: this.USUARIO_PAIS,
        //datos de la consulta
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta
      };

      const dataForm = new FormData();
      Object.entries(dataObj).forEach(([clave, valor]) => {
        dataForm.append(clave, valor);
      });

      let rawResponse = null;
      const { data } = await axios.post(url, dataForm, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      rawResponse = data;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        allowBooleanAttributes: true,
        numberParseOptions: {
            leadingZeros: true,
            hex: true,
            skipLike: /\+[0-9]{10}/,
            eNotation: false
        }
      });

      // rawResponse = '<?xml version="1.0" encoding="ISO-8859-1"?>'+
      // '<TransactionStatusReport Comunidad="30999284031" FechaCreacion="14/07/2025" HoraCreacion="15:34:07.928" Version="1.0">'+
      // '<TransactionStatus><ClienteCUIT>30264564685</ClienteCUIT><NumeroOperacion>9980629</NumeroOperacion><NumeroOperacionIB>0</NumeroOperacionIB><NumeroInterno>1</NumeroInterno><NumeroCuentaRecaudacion>017013040000030</NumeroCuentaRecaudacion><FechaPago>14/07/2025</FechaPago><Importe>825.08</Importe><Estado>EJ</Estado><MotivoRechazo/><Observaciones>Pago de Facturas por Cobranzas on line</Observaciones></TransactionStatus>'+
      // '<TransactionStatus><ClienteCUIT>30264564685</ClienteCUIT><NumeroOperacion>9980630</NumeroOperacion><NumeroOperacionIB>0</NumeroOperacionIB><NumeroInterno>2</NumeroInterno><NumeroCuentaRecaudacion>017013040000030</NumeroCuentaRecaudacion><FechaPago>14/07/2025</FechaPago><Importe>276.21</Importe><Estado>EC</Estado><MotivoRechazo/><Observaciones>Pago de Facturas por Cobranzas on line</Observaciones></TransactionStatus>'+
      // '<TransactionStatus><ClienteCUIT>30264564685</ClienteCUIT><NumeroOperacion>9980631</NumeroOperacion><NumeroOperacionIB>0</NumeroOperacionIB><NumeroInterno>3</NumeroInterno><NumeroCuentaRecaudacion>017013040000030</NumeroCuentaRecaudacion><FechaPago>14/07/2025</FechaPago><Importe>276.21</Importe><Estado>EC</Estado><MotivoRechazo/><Observaciones>Pago de Facturas por Cobranzas on line</Observaciones></TransactionStatus>'+
      // '<TransactionStatus><ClienteCUIT>30264564685</ClienteCUIT><NumeroOperacion>31</NumeroOperacion><NumeroOperacionIB>0</NumeroOperacionIB><NumeroInterno>1623268</NumeroInterno><NumeroCuentaRecaudacion>017013040000030</NumeroCuentaRecaudacion><FechaPago>14/10/2004</FechaPago><Importe>100.0</Importe><Estado>CA</Estado><MotivoRechazo>Número de Cuenta de Débito no existe</MotivoRechazo><Observaciones>Pago de Facturas por</Observaciones></TransactionStatus>'+
      // '</TransactionStatusReport>';

      const parsed = parser.parse(rawResponse);

      const paymentsData:PaymentData[] = [];
      const result = parsed.TransactionStatusReport;
      if (result.TransactionStatus) {
        const transactionStatus = Array.isArray(result.TransactionStatus) ? result.TransactionStatus : [result.TransactionStatus];
        const transactions = transactionStatus.filter(f => f.Estado == "EJ" || f.Estado == "EC");
        for (let i=0; i < transactions.length; i++) {
          const pago = transactions[i];
          const paymentData: PaymentData = {
            id: pago.NumeroInterno,
            status: true, //ya estoy filtrando el estado en la consulta
            externalId: pago.NumeroOperacion.toString(),
            transactionAmount: pago.Importe,
            createDate: getStringToDate(pago.FechaPago),
            data: null,
          };
          paymentsData.push(paymentData);
        }
      }
      else if (result.Error && result.Error.Mensaje) {
        throw new Error(`Error consultando pagos: ${result.Error.Mensaje}`);
      }

      return paymentsData;
    }
    catch (error) {
      throw new Error("No se pudo obtener el pago.");
    }
  }

}
