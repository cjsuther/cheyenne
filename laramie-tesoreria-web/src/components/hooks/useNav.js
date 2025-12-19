import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { MessageModalContext } from "../../context/custom"
import { MESSAGE_MODALS } from "../../context/custom/MessageModalContext"

export const useNav = () => {
    const navigate = useNavigate()

    const { showMessageModal } = useContext(MessageModalContext)

    return ({ to, unless, refresh, replace, options }) => {
        if ((typeof unless === 'function' && unless()) || unless ) {
            showMessageModal({
                ...MESSAGE_MODALS.CONFIRM_SALIR,
                onConfirm: () => navigate(to, { replace, ...options }),
            })
        }
        else {
            navigate(to, options)
            if (refresh) navigate(0)
        }
    }
}
