import { APIS } from "../../../config/apis"
import { ALERT_TYPE } from "../../../consts/alertType"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { ServerRequest } from "../../../utils/apiweb"
import { onRequestError, onRequestNoSuccess } from "../../../utils/requests"
import ShowToastMessage from "../../../utils/toast"
import { isValidNumber } from "../../../utils/validator"
import { InputNumber, Modal } from "../../common"
import { useForm, useManagedContext } from "../../hooks"


const RecaudacionControlModal = ({ lote, onCancel, onConfirm }) => {
    const { setIsLoading } = useManagedContext()
    
    const [formValues, formHandle, , ] = useForm({
        importeNeto: 0
    })

    const paramsUrl = `/control/${lote.id}`
    const dataBody = {
        importeNeto: formValues.importeNeto
    }

    const ConfirmarControl = () => {
        setIsLoading(true)
        
        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            paramsUrl,
            dataBody,
            () => {
                onConfirm()
                setIsLoading(false)
            },
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
        if (!isValidNumber(formValues.importeNeto, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el importe neto')
        if (formValues.importeNeto > lote.importeTotal) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El importe neto no puede ser superior al importe total')

        ConfirmarControl()
    }

    return (
        <Modal
            size="md"
            title={"Confirmación de control de lote"}
            body={(
                <div className='row form-basic'>
                    <div className="col-12 col-lg-6">
                        <label htmlFor="importeTotal" className="form-label">Importe total</label>
                        <InputNumber
                            precision={2}
                            name="importeTotal"
                            placeholder=""
                            className="form-control"
                            value={lote.importeTotal}
                            disabled={true}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <label htmlFor="importeNeto" className="form-label">Importe neto</label>
                        <InputNumber
                            precision={2}
                            name="importeNeto"
                            placeholder=""
                            className="form-control"
                            value={formValues.importeNeto}
                            onChange={formHandle}
                        />
                    </div>
                </div>
            )}
            footer={(
                <div className="width-100p disp-b">
                    <button className="btn back-button m-left-5" data-dismiss="modal" onClick={onCancel}>Volver</button>
                    <button className="btn action-button" data-dismiss="modal" onClick={onClickConfirm}>Confirmar</button>
                </div>
            )}
        />
    )
}

export default RecaudacionControlModal
