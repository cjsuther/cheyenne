import { InputCuenta, Modal } from "../../../components/common"
import { ALERT_TYPE } from "../../../consts/alertType"
import { OPERATION_MODE } from "../../../consts/operationMode"
import ShowToastMessage from "../../../utils/toast"

const CuentasPruebaEditModal = ({ item, setItem, mode, onAccept, onCancel }) => {
    return (
        <Modal
            show
            header={<h2 className="modal-title">Definición de Cuenta de Prueba</h2>}
            body={(
                <div className='row form-basic'>
                    <div className="col-12">
                        <label htmlFor="idCuenta" className="form-label">Cuenta</label>
                        <InputCuenta
                          name="idCuenta"
                          placeholder=""
                          className="form-control"
                          value={item.idCuenta}
                          onChange={({ target }) => setItem({ ...item, idCuenta: target.value })}
                          idTipoTributo={item.idTipoTributo}
                          disabled={mode !== OPERATION_MODE.NEW}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="comentario" className="form-label">Comentario</label>
                        <textarea
                            name="comentario"
                            placeholder=""
                            className="form-control"
                            value={item.comentario}
                            onChange={({ target }) => setItem({ ...item, comentario: target.value })}
                            disabled={mode === OPERATION_MODE.VIEW}
                            rows="4"
                        />
                    </div>
                </div>
            )}
            footer={<>
                {mode !== OPERATION_MODE.VIEW && (
                    <button className="btn btn-primary" data-dismiss="modal" onClick={onAccept}>Aceptar</button>
                )}
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={onCancel}>Cancelar</button>
            </>}
        />
    )
}

export default CuentasPruebaEditModal
