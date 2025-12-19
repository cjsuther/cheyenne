import { APIS } from '../config/apis'
import { ALERT_TYPE } from '../consts/alertType'
import { localService } from './localService'
import ShowToastMessage from './toast'

export const printTicket = (data = []) => {
	const ORDEN_IMPRESION_TICKET = 10 //* Valor constante que indica la impresion del ticket en el servicio local
	const IMPRESORA = '' // 'EPSON TM-U220 Receipt' //'Microsoft Print to PDF'

    const peticion = {
		Orden: ORDEN_IMPRESION_TICKET,
		Texto: IMPRESORA,
		Id: 0,
		Datos: data,
	}

	localService(
		APIS.URLS.PRINTER,
		'',
		peticion,
		() => {
			ShowToastMessage(ALERT_TYPE.ALERT_INFO, 'Ticket impreso')
		},
		error => {
			ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Ocurrio un error al imprimir el ticket')
		}
	)
}
