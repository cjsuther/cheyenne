import { useContext } from "react"
import { ManagedContext } from "../../context/custom"

export const useManagedContext = () => {
    const context = useContext(ManagedContext)

    return context
}