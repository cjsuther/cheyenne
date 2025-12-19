import { useState } from "react"
import { InputLista, Modal } from "../../../common"
import { openTempView } from "../../../../utils/openTempView"
import { APPCONFIG } from "../../../../app.config"
import { TIPO_TRIBUTO_URLS } from "../consts"
import ShowToastMessage from "../../../../utils/toast"
import { ALERT_TYPE } from "../../../../consts/alertType"

export const SelectTipoTributoModal = ({ show, close }) => {
    const [value, setValue] = useState(0)

    const onAccept = () => {
        if (!TIPO_TRIBUTO_URLS[value]) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de tributo')
        }
        else {
            close()
            openTempView(`${APPCONFIG.SITE.WEBAPP}${TIPO_TRIBUTO_URLS[value]}/new`)
        }
    }

    return (
        <Modal
            show={show}
            title='Selección de Tipo de Tributo'
            body={(
                <div className='row form-basic'>
                    <div className="col-12">
                        <label htmlFor="idTipoTributo" className="form-label">Tipo de tributo</label>
                        <InputLista
                            name="idTipoTributo"
                            placeholder=""
                            className="form-control"
                            value={value}
                            onChange={({ target }) => setValue(target.value)}
                            lista="TipoTributo"
                        />
                    </div>
                </div>
            )}
            footer={<>
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={close}>Cancelar</button>
                <button className="btn btn-primary" data-dismiss="modal" onClick={onAccept}>Aceptar</button>
            </>}
        />
    )
}