import { useEffect, useMemo } from "react"
import { APIS } from "../../../config/apis"
import { ALERT_TYPE } from "../../../consts/alertType"
import { TIPO_MOVIMIENTO_CAJA } from "../../../consts/tipoMovimientoCaja"
import { MEDIO_PAGO } from "../../../consts/medioPago"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { ServerRequest } from "../../../utils/apiweb"
import { onRequestError, onRequestNoSuccess } from "../../../utils/requests"
import ShowToastMessage from "../../../utils/toast"
import { isValidNumber } from "../../../utils/validator"
import { InputNumber, Modal } from "../../common"
import { useForm, useManagedContext } from "../../hooks"


const MovimientoCajaModal = ({ idTipoMovimientoCaja, cajaResumen, onCancel, onConfirm }) => {
    const { setIsLoading } = useManagedContext()

    const [formValues, formHandle, , formSet] = useForm({
        efectivoDisponible: 0,
        efectivoOperacion: 0,
        observacion: ""
    })

    const efectivoRestante = useMemo(() => {
        if (idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.INGRESO)
            return (formValues.efectivoDisponible + formValues.efectivoOperacion)
        else if (idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.RETIRO)
            return (formValues.efectivoDisponible - formValues.efectivoOperacion)
        return 0
    }, [formValues.efectivoDisponible, formValues.efectivoOperacion])

    useEffect(() => {
        let efectivoDisponible = cajaResumen.asignacion.importeSaldoInicial;
        for (let m=0; m<cajaResumen.movimientos.length; m++) {
            const movimiento = cajaResumen.movimientos[m];
            if (movimiento.idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.COBRANZA) {
                for (let mp=0; mp<movimiento.mediosPagos.length; mp++) {
                    const medioPago = movimiento.mediosPagos[mp];
                    if (medioPago.idMedioPago === MEDIO_PAGO.EFECTIVO) {
                        efectivoDisponible += medioPago.importeCobro;
                    }
                }
            }
            else if (movimiento.idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.RETIRO) {
                efectivoDisponible -= movimiento.importeCobro;
            }
            else if (movimiento.idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.INGRESO) {
                efectivoDisponible += movimiento.importeCobro;
            }
        }
        formSet({...formValues, efectivoDisponible: efectivoDisponible, efectivoOperacion: 0, observacion: ""})
    }, [cajaResumen]);

    const AplicarOperacion = (importe) => {

        setIsLoading(true)

        const operacion = getData().path;
        const paramsUrl = `/movimiento/${operacion}/${cajaResumen.caja.id}`
        const dataBody = {
            importe: formValues.efectivoOperacion,
            observacion: formValues.observacion
        }

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            dataBody,
            res => res.json().then(({idMovimientoCaja}) => {
                console.log(idMovimientoCaja) //TODO: emitir comprobante
                onConfirm();
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

    const getData = () => {
        const operacion =
        (idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.INGRESO) ? {
            path: "ingreso",
            labelControl: "Importe a ingresar",
            labelButton: "Ingresar",
            title: "Ingreso de dinero",
            result: () => (formValues.efectivoDisponible + formValues.efectivoOperacion)
        } :
        (idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.RETIRO) ? {
            path: "retiro",
            labelControl: "Importe a retirar",
            labelButton: "Retirar",
            title: "Retiro de dinero",
            result: () => (formValues.efectivoDisponible - formValues.efectivoOperacion)
        } :
        {
            path: "",
            labelButton: "",
            title: "",
            result: () => 0
        }

        return operacion
    }

    const onClickConfirm = () => {
        if (!isValidNumber(formValues.efectivoOperacion, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el importe de la operación')
        if (getData().result() < 0) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El importe restante no puede ser negativo')
        AplicarOperacion()
    }

    return (
        <Modal
            size="lg"
            title={getData().title}
            body={(
                <div className='row form-basic'>
                    <div className="col-12 col-lg-4">
                        <label htmlFor="efectivoDisponible" className="form-label">Efectivo disponible</label>
                        <InputNumber
                            precision={2}
                            name="efectivoDisponible"
                            placeholder=""
                            className="form-control"
                            value={formValues.efectivoDisponible}
                            disabled={true}
                        />
                    </div>
                    <div className="col-12 col-lg-4">
                        <label htmlFor="efectivoOperacion" className="form-label">{getData().labelControl}</label>
                        <InputNumber
                            precision={2}
                            name="efectivoOperacion"
                            placeholder=""
                            className="form-control"
                            value={formValues.efectivoOperacion}
                            onChange={formHandle}
                        />
                    </div>
                    <div className="col-12 col-lg-4">
                        <label htmlFor="efectivoRestante" className="form-label">Efectivo restante</label>
                        <InputNumber
                            precision={2}
                            name="efectivoRestante"
                            placeholder=""
                            className="form-control"
                            value={efectivoRestante}
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
                    <button className="btn action-button" data-dismiss="modal" onClick={onClickConfirm}>{getData().labelButton}</button>
                </div>
            )}
        />
    )
}

export default MovimientoCajaModal
