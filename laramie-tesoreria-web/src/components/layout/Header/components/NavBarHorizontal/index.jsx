import { NavLink } from 'react-router-dom';

import UserSubMenu from '../UserSubMenu';

// import logo from '../../../../../assets/images/LogoMunicipio.png';

const NavBarHorizontal = ({ isAuthenticated, username, publicRoutes, privateRoutes, handleClickHome, handleClickMenu, handleClickLogout }) => {
            
    return (
        <div className="container-fluid">
            <div onClick={ handleClickHome }>
                {/*  <img src={logo} alt="logo" className='navlogo link'/> */}
                <div className='navlogo logo' alt="logo"></div>
            </div>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav navbar-routes">
                    {!isAuthenticated && (
                        publicRoutes.filter(item => item.nivelMenu === 1).map((route, index) => (
                        <li className="nav-item" key={index}>
                            <NavLink to={route.path} className="nav-link">{route.title}</NavLink>
                        </li>
                        ))
                    )}
                    {isAuthenticated && (
                        privateRoutes.filter(item => item.nivelMenu === 1).map((route, index) =>
                            (route.children.length === 0) ?
                            <li className="nav-item" key={index} onClick={(evnet) => handleClickMenu(null)}>
                                {Array.isArray(route.path) ?
                                <NavLink to={route.path[0]} className="nav-link">{route.title}</NavLink> :
                                <NavLink to={route.path} className="nav-link">{route.title}</NavLink>}
                            </li>
                            :
                            <li className="nav-item dropdown" key={index}
                                onMouseLeave={() => handleClickMenu(null)}
                                onMouseEnter={() => handleClickMenu(route.index)}
                            >
                                <a className="nav-link dropdown-toggle" onClick={(evnet) => handleClickMenu(route.index)}
                                    
                                >
                                    {route.title}
                                </a>
                                <ul className={(route.selected) ? "dropdown-menu show" : "dropdown-menu"}>
                                    {privateRoutes.filter(subitem => route.children.includes(subitem.index) && subitem.nivelMenu === 2).map((subroute, subindex) =>
                                        <li key={subindex} onClick={(evnet) => handleClickMenu(null)}>
                                            {Array.isArray(subroute.path) ?
                                            <NavLink to={subroute.path[0]} className="nav-link">{subroute.title}</NavLink> :
                                            <NavLink to={subroute.path} className="nav-link">{subroute.title}</NavLink>}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        )
                    )}
                </ul>
            </div>

            <div className='collapse navbar-collapse login-nav'>
                {<UserSubMenu />}
            </div>
        </div>
    )
}

export default NavBarHorizontal
