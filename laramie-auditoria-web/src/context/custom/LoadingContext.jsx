import { createContext, useState } from "react";

import { Loading } from "../../components/common";

const LoadingContext = createContext(null)

export const LoadingContextManager = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{ setIsLoading }}>
            <Loading visible={isLoading} />

            {children}
        </LoadingContext.Provider>
    )
}

export default LoadingContext
