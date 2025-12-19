import { NavLink } from "react-router-dom"

export const buildNavLink = (route, setModal) => {
    const props = {}

    if (route.path) {
        props.to = Array.isArray(route.path) ? route.path[0] : route.path
        props.className = "nav-link"
    }
    else if (route.modal) {
        props.onClick = () => setModal(route.modal)
        props.className = () => "nav-link"
    }

    return <NavLink {...props}>{route.title}</NavLink>
}