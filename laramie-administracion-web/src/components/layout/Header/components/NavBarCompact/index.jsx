import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom';

import logo from '../../../../../assets/images/LogoMunicipio.png';
import './index.scss'

const NavBarCompact = ({ isAuthenticated, publicRoutes, privateRoutes, handleClickHome, handleClickMenu, handleClickLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false)

    const onClickFinal = (index) => {
        setMenuOpen(false)
        handleClickMenu(index)
    }

    const topRoutes = useMemo(
        () => (isAuthenticated ? privateRoutes : publicRoutes).filter(route => route.nivelMenu === 1),
        [isAuthenticated, publicRoutes, privateRoutes]
    )

    return (
        <div className="navbar-compact">
            <div className="navbar-row">
                <div onClick={handleClickHome}>
                    <img src={logo} alt="logo" className='navlogo link'/>
                </div>
        
                <div className="display-row" style={{ flex: 1 }}>
                    <a className="nav-link" href="#">
                        <div className="display-row" onClick={() => setMenuOpen(x => !x)}>
                            <i className="fa fa-bars" title="ver" />
                            <div className="nav-item p-left-10">Menú</div>
                        </div>
                    </a>

                    {isAuthenticated && (
                        <a className="nav-link display-row" style={{ marginLeft: 'auto', }} onClick={handleClickLogout}>
                            <div className="nav-item"><i className='fas fa-sign-out-alt'></i></div>
                            <div className="nav-item p-left-10">Logout</div>
                        </a>
                    )}
                </div>
            </div>

            <div className={"navbar-compact-menu"} style={{ maxHeight: menuOpen ? topRoutes.length * 35 + 15 : 0 }}>
                {topRoutes.map((route, index) => (
                    (route.children.length === 0) ? (
                        <div className="" key={index} onClick={() => onClickFinal(null)}>
                            <NavLink to={route.path} className="nav-link">{route.title}</NavLink>
                        </div>
                    ) : (
                        <div className="dropdown" key={index}>
                            <a className="nav-link" href="#" onClick={() => handleClickMenu(route.index)}>
                                {route.title}
                            </a>
                            <ul className={(route.selected) ? "dropdown-menu show" : "dropdown-menu"} style={{ position: 'fixed' }}>
                                {privateRoutes.filter(subitem => route.children.includes(subitem.index) && subitem.nivelMenu === 2).map((subroute, subindex) =>
                                    <li key={subindex} onClick={() => onClickFinal(null)}>
                                        <NavLink to={subroute.path} className="nav-link">{subroute.title}</NavLink>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default NavBarCompact
