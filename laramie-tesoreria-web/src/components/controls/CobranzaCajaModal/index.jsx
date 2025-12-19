import { useEffect, useState } from "react"
import { APIS } from "../../../config/apis"
import { ALERT_TYPE } from "../../../consts/alertType"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { ServerRequest } from "../../../utils/apiweb"
import { onRequestError, onRequestNoSuccess } from "../../../utils/requests"
import ShowToastMessage from "../../../utils/toast"
import { InputNumber, Modal } from "../../common"
import { useForm, useManagedContext } from "../../hooks"
import { getDateNow } from "../../../utils/convert"
import { useReporte } from "../../hooks/useReporte"
import { printTicket } from "../../../utils/printTicket"


const cobranzaInit = {
    importeCobro: 0,
    importePago: 0,
    observacion: ""
}

const CobranzaCajaModal = ({ recibos, mediosPagos, cajaResumen, onCancel, onConfirm }) => {
    const { setIsLoading } = useManagedContext()

    const [formValues, formHandle, , formSet] = useForm(cobranzaInit)

    useEffect(() => {
        const fechaCobro = getDateNow(false);
        let importeCobro = 0;
        for(let r=0; r<recibos.length; r++) {
            const recibo = recibos[r];
            let importeVencimiento = 0;
            if (fechaCobro.getTime() <= recibo.fechaVencimiento1.getTime()) {
                importeVencimiento = recibo.importeVencimiento1;
            }
            else if (fechaCobro.getTime() <= recibo.fechaVencimiento2.getTime()) {
                importeVencimiento = recibo.importeVencimiento2;
            }
            importeCobro += importeVencimiento;
        }
        let importePago = 0;
        for(let mp=0; mp<mediosPagos.length; mp++) {
            const medioPago = mediosPagos[mp];
            importePago += medioPago.importeCobro;
        }
        formSet({...cobranzaInit, importeCobro: importeCobro, importePago: importePago})
    }, [recibos, mediosPagos])

    const [ generateReporte, ] = useReporte({
        callback: (reporte, data, message) => {
            if (data) {
                //OpenObjectURL(`${reporte}.pdf`, buffer)
                printTicket(data)
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message)
            }
        },
        mode: 'json'
    })

    const AplicarCobranza = () => {

        setIsLoading(true)

        const paramsUrl = `/movimiento/cobranza/${cajaResumen.caja.id}`
        const dataBody = {
            observacion: formValues.observacion,
            mediosPagos: mediosPagos,
            recibos: recibos.map(x => x.id)
        }

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            dataBody,
            res => res.json().then(({idMovimientoCaja}) => {
                emitirCajaTicket(idMovimientoCaja)
                onConfirm()
                setIsLoading(false)
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }

    const onClickConfirm = () => {
        if (formValues.importeCobro !== formValues.importePago) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El monto pagado difiere del monto a cobrar')

        AplicarCobranza()
    }

    const emitirCajaTicket = (idMovimientoCaja) => {
        const paramsReporte = {
            idMovimientoCaja: idMovimientoCaja
        }
        generateReporte("CajaTicket", paramsReporte);
    }

    return (
        <Modal
            size="md"
            title="Cobro de recibos"
            body={(
                <div className='row form-basic'>
                    <div className="col-12 col-lg-6">
                        <label htmlFor="importeCobro" className="form-label">Total a pagar</label>
                        <InputNumber
                            precision={2}
                            name="importeCobro"
                            placeholder=""
                            className="form-control"
                            value={formValues.importeCobro}
                            disabled={true}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="observacion" className="form-label">Observación</label>
                        <input
                            type="text"
                            name="observacion"
                            placeholder=""
                            className="form-control"
                            value={formValues.observacion}
                            onChange={formHandle}
                            maxLength={250}
                        />
                    </div>
                </div>
            )}
            footer={(
                <div className="width-100p disp-b">
                    <button className="btn back-button m-left-5" data-dismiss="modal" onClick={onCancel}>Volver</button>
                    <button className="btn action-button" data-dismiss="modal" onClick={onClickConfirm}>Cobrar</button>
                </div>
            )}
        />
    )
}

export default CobranzaCajaModal
