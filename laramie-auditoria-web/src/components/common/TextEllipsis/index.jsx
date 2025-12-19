import { useEffect, useRef, useState } from "react"
import "./index.scss"

const TextEllipsis = ({ className, children }) => {
    const ref = useRef(null)
    const [isOverflowed, setIsOverflowed] = useState(false)

    const updateOverflow = () => setIsOverflowed(ref.current.scrollWidth > ref.current.clientWidth)

    useEffect(() => {
        updateOverflow()

        window.addEventListener('resize', updateOverflow)

        return () => {
            window.removeEventListener('resize', updateOverflow)
        }
    }, []);

    if (className) className += ' tooltip-container text-ellipsis'
    else className = 'tooltip-container text-ellipsis'

    return (
        <div {...{ref, className}}>
            {children}
            {isOverflowed && <span className="tooltip">{children}</span>}
        </div>
    )
}

export default TextEllipsis