import { useContext, useMemo, useState } from 'react';

import { HeaderContext } from '../../'

import { getAccess } from '../../../../../utils/access'

import './index.scss'
import ChangePasswordModal from './components/ChangePasswordModal';

const UserSubMenu = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { isAuthenticated, handleClickLogout } = useContext(HeaderContext)
    const { nombreApellido, codigo, email } = useMemo(() => getAccess(), [])

    if (!isAuthenticated) return ''

    return <>
        {isModalOpen && <ChangePasswordModal close={() => setIsModalOpen(false)} username={codigo} />}

        <div className='user-sub-menu'>
            <div className="nav-link display-row">
                <div className="navbar-nav">
                    <div
                        className="nav-item nav-link-login"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        <span className="material-symbols-outlined">account_circle</span>
                        <ul className={`dropdown-menu show navbar-nav user-sub-menu-dropdown ${isOpen ? 'open' : 'closed'}`}>
                            <li><span className='nav-link no-click'>{nombreApellido}</span></li>
                            <li><span className='nav-link no-click'>{codigo}</span></li>
                            <li><span className='nav-link no-click'>{email}</span></li>
                            <li><a className='nav-link menu-pass' onClick={() => setIsModalOpen(true)}>Cambiar contraseña</a></li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-nav">
                    <div onClick={handleClickLogout} className="nav-item nav-link-login">
                        <span className="power material-symbols-outlined">power_settings_new</span>
                    </div>
                </div>
            </div>            
        </div>
    </>
}

export default UserSubMenu
