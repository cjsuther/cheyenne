import { useManagedContext, useNav } from "../../hooks"
import { MESSAGE_MODALS } from "../../../context/custom/MessageModalContext"
import { useDispatch } from "react-redux"
import { dataTaggerActionClear } from "../../../context/redux/actions/dataTaggerAction"

// TODO: manejar processKey en contexto global
export const FooterButtonVolver = ({ pendingChange, processKey }) => {
    const { isTempView, showMessageModal } = useManagedContext()
    const navigate = useNav()
    const dispatch = useDispatch()

    const onClickSalir = () => {
        const close = () => {
            if (processKey) dispatch(dataTaggerActionClear(processKey))

            window.close()
        }

        if (pendingChange) showMessageModal({ ...MESSAGE_MODALS.CONFIRM_SALIR, onConfirm: close })
        else close()
    }

    const onClickVolver = () => {
        const volver = () => {
            if (processKey) dispatch(dataTaggerActionClear(processKey))
            navigate({ to: -1 })
        }

        if (pendingChange) showMessageModal({ ...MESSAGE_MODALS.CONFIRM_SALIR, onConfirm: volver })
        else volver()
    }

    return isTempView ? (
        <button className="btn back-button float-start" onClick={onClickSalir}>Volver</button>
    ) : (
        <button className="btn back-button float-start" onClick={onClickVolver}>Volver</button>
    )
}