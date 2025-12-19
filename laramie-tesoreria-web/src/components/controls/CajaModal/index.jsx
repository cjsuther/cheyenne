import { useEffect, useState } from "react"
import { APIS } from "../../../config/apis"
import { ALERT_TYPE } from "../../../consts/alertType"
import { ESTADO_CAJA } from "../../../consts/estadoCaja"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { ServerRequest } from "../../../utils/apiweb"
import { onRequestError, onRequestNoSuccess } from "../../../utils/requests"
import ShowToastMessage from "../../../utils/toast"
import { isValidNumber } from "../../../utils/validator"
import { InputEntidad, InputLista, InputUsuario, Modal } from "../../common"
import { useForm, useManagedContext } from "../../hooks"

const entityInit = {
    id: -1,
    codigo: '',
    nombre: '',
    orden: 0,
    idDependencia: 0,
    idEstadoCaja: 0,
    idUsuarioActual: 0,
    idCajaAsignacionActual: 0,
    idRecaudadora: 0,
}

const CajaModal = ({ editItem, editMode, onCancel, onConfirm }) => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const [entity, setEntity] = useState(entityInit)
    const [formValues, formHandle, _formReset, formSet] = useForm({
        codigo: '',
        nombre: '',
        orden: 0,
        idDependencia: 0,
        idEstadoCaja: 0,
        idRecaudadora: 0,
    })

    useEffect(() => {
        setEntity(editItem)
        formSet({
            codigo: editItem.codigo,
            nombre: editItem.nombre,
            orden: editItem.orden,
            idDependencia:editItem.idDependencia,
            idEstadoCaja: editItem.idEstadoCaja,
            idRecaudadora: editItem.idRecaudadora,
        })
    }, [editItem])

    const estadoCajaFilter = row =>
        editMode === 'add'
            ? row.id === ESTADO_CAJA.INACTIVA
            : row.id === ESTADO_CAJA.CERRADA || 
              row.id === ESTADO_CAJA.INACTIVA ||
              row.id === ESTADO_CAJA.ABIERTA && entity.idEstadoCaja === ESTADO_CAJA.ABIERTA;

    const Guardar = () => {
        setIsLoading(true)

        ServerRequest(
            editMode === 'add' ? REQUEST_METHOD.POST : REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CAJA,
            editMode === 'modify' ? `/${entity.id}` : '',
            { ...entity, ...formValues, orden: parseInt(formValues.orden) ?? 0 },
            res => res.json().then(() => {
                setIsLoading(false)
                onConfirm()
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            error => {
                onRequestError(error)
                setIsLoading(false)
            },
        )
    }
    const Cerrar = () => {
        setIsLoading(true)

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CAJA,
            `/cierre/${entity.id}`,
            null,
            res => res.json().then(() => {
                setIsLoading(false)
                onConfirm()
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            error => {
                onRequestError(error)
                setIsLoading(false)
            },
        )
    }

    const onClickConfirm = () => {
        if (formValues.codigo.length < 1) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar el campo Código')
        if (formValues.nombre.length < 1) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar el campo Nombre')
        if (!isValidNumber(formValues.orden, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar el campo Orden')
        if (!isValidNumber(formValues.idDependencia, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar el campo Dependencia')
        if (!isValidNumber(formValues.idEstadoCaja, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar el campo Estado')
        if (!isValidNumber(formValues.idRecaudadora, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar el campo Recaudadora')

        Guardar();
    }
    const onClickCerrar = () => {
        showMessageModal({
            title: "Confirmación",
            message: "¿Está seguro/a de cerrar la caja?",
            onConfirm: () => Cerrar(),
        })
    }

    const disabled = editMode === 'view'
    const isEstadoDisabled = disabled || editMode === 'add' || entity.idEstadoCaja === ESTADO_CAJA.ABIERTA

    return (
        <Modal
            size="lg"
            title="Caja"
            body={(
                <div className='row form-basic'>
                    <div className="col-12 col-md-2">
                        <label htmlFor="codigo" className="form-label">Código</label>
                        <input
                            type="text"
                            name="codigo"
                            maxLength={50}
                            className="form-control"
                            value={formValues.codigo}
                            onChange={formHandle}
                            disabled={disabled || entity.idEstadoCaja === ESTADO_CAJA.ABIERTA}
                        />
                    </div>
                    <div className="col-12 col-md-5">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-control"
                            value={formValues.nombre}
                            onChange={formHandle}
                            disabled={disabled || entity.idEstadoCaja === ESTADO_CAJA.ABIERTA}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <label htmlFor="idEstadoCaja" className="form-label">Estado</label>
                        <InputLista
                            name="idEstadoCaja"
                            className="form-control"
                            value={formValues.idEstadoCaja}
                            onChange={formHandle}
                            disabled={isEstadoDisabled}
                            lista="EstadoCaja"
                            filter={estadoCajaFilter}
                            withItemZero={false}
                        />
                    </div>
                    <div className="col-12 col-md-2">
                        <label htmlFor="orden" className="form-label">Orden</label>
                        <input
                        name="orden"
                        type="number"
                        placeholder=""
                        className="form-control"
                        value={formValues.orden}
                        onChange={formHandle}
                        disabled={disabled || entity.idEstadoCaja === ESTADO_CAJA.ABIERTA}
                        />
                    </div>

                    <div className="col-12 col-md-7">
                        <label htmlFor="idDependencia" className="form-label">Dependencia</label>
                        <InputEntidad
                            name="idDependencia"
                            placeholder=""
                            className="form-control"
                            value={formValues.idDependencia}
                            onChange={formHandle}
                            disabled={disabled || entity.idEstadoCaja === ESTADO_CAJA.ABIERTA}
                            entidad="Dependencia"
                            title="Dependencia"
                        />
                    </div>
                    <div className="col-12 col-md-5">
                        <label htmlFor="idRecaudadora" className="form-label">Recaudadora</label>
                        <InputEntidad
                            name="idRecaudadora"
                            placeholder=""
                            className="form-control"
                            value={formValues.idRecaudadora}
                            onChange={formHandle}
                            disabled={disabled || entity.idEstadoCaja === ESTADO_CAJA.ABIERTA}
                            entidad="Recaudadora"
                            title="Recaudadora"
                        />
                    </div>
                    {entity.idEstadoCaja === ESTADO_CAJA.ABIERTA &&
                    <div className="col-12">
                        <label htmlFor="idUsuarioActual" className="form-label">Usuario</label>
                        <InputUsuario
                            name="idUsuarioActual"
                            placeholder=""
                            className="form-control"
                            value={entity.idUsuarioActual}
                            disabled={true}
                        />
                    </div>
                    }

                </div>
            )}
            footer={(
                <div className="width-100p disp-b">
                    <button className="btn back-button m-left-5" data-dismiss="modal" onClick={onCancel}>Volver</button>
                    {editMode !== 'view' && entity.idEstadoCaja !== ESTADO_CAJA.ABIERTA && (
                        <button className="btn action-button" data-dismiss="modal" onClick={onClickConfirm}>Guardar</button>
                    )}
                    {editMode === 'modify' && entity.idEstadoCaja === ESTADO_CAJA.ABIERTA && (
                        <button className="btn action-button" data-dismiss="modal" onClick={onClickCerrar}>Cerrar</button>
                    )}
                </div>
                
            )}
        />
    )
}

export default CajaModal
