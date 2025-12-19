import { createContext, useState } from "react"

import { MessageModal } from "../../components/common"

const MessageModalContext = createContext(null)

export const MessageModalContextManager = ({ children }) => {
    const [queue, setQueue] = useState([])

    const modal = queue[0]

    const dequeue = () => {
        setQueue(prev => prev.slice(1))
    }

    const showMessageModal = (props) => {
        setQueue(prev => [...prev, props])
    }

    return (
        <MessageModalContext.Provider value={{ showMessageModal }}>
            {modal && (
                <MessageModal
                    title={modal.title}
                    message={modal.message}
                    onDismiss={() => {
                        modal.onDismiss?.()
                        dequeue()
                    }}
                    onConfirm={() => {
                        modal.onConfirm?.()
                        dequeue()
                    }}
                />
            )}
            {children}
        </MessageModalContext.Provider>
    )
}

export const MESSAGE_MODALS = {
    BORRAR: {
        title: "Confirmación",
        message: "¿Está seguro de borrar el registro?",
    },
    CLONAR: {
        title: "Confirmación",
        message: "¿Está seguro de clonar el registro?",
    },
    CONFIRM_SALIR: {
        title: 'Confirmación',
        message: 'Hay cambios sin guardar. ¿Desea salir de todas formas?',
    }
}

export default MessageModalContext
