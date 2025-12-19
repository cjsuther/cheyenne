import { createContext } from "react";
import MessageModalContext, { MessageModalContextManager } from "./MessageModalContext";
import { useContext } from "react";
import LoadingContext, { LoadingContextManager } from "./LoadingContext";

const ManagedContext = createContext(null)

const Compilator = ({ children }) => {
    const { setIsLoading } = useContext(LoadingContext)
    const { showMessageModal } = useContext(MessageModalContext)

    const compiledContext = {
        setIsLoading,
        showMessageModal,
    }

    return (
        <ManagedContext.Provider value={compiledContext}>
            {children}
        </ManagedContext.Provider>
    )
}

export const ContextManager = ({ children }) => (
    <MessageModalContextManager>
        <LoadingContextManager>
            <Compilator>
                {children}
            </Compilator>
        </LoadingContextManager>
    </MessageModalContextManager>
)

export default ManagedContext
