import { useNavigate } from "react-router-dom"

import { MESSAGE_MODALS } from "../../context/custom/MessageModalContext"
import { useManagedContext } from "./useManagedContext"


export const useNav = () => {
    const navigate = useNavigate()

    const { isTempView, showMessageModal } = useManagedContext()

    return ({ to, unless, refresh, replace, options }) => {
        if (isTempView) to += '?tempView=true'

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
