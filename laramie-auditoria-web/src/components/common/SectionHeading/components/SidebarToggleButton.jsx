import { useMemo, useState } from 'react'

const SidebarToggleButton = ({ onClick, isSidebarOpen }) => {
    const [isHovered, setIsHovered] = useState(false)

    const icon = useMemo(() => {
        if (isSidebarOpen) return 'chevron_left'
        else if (isHovered) return 'chevron_right'
        else return 'menu'
    }, [isSidebarOpen, isHovered])

    const onMouseOver = () => setIsHovered(true)
    const onMouseOut = () => setIsHovered(false)

    return (
            <span className="material-symbols-outlined link tooltip-container" {...{onClick, onMouseOver, onMouseOut}}>
                {icon}
                <span className="tooltip">{isSidebarOpen ? 'Ocultar menú lateral' : 'Abrir menú lateral'}</span>
            </span>
    )
}

export default SidebarToggleButton