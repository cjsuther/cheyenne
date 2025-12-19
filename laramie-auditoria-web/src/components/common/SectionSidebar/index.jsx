import React, { useEffect, useState } from 'react'
import { bool, func, array } from 'prop-types';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
} from 'react-pro-sidebar';
import { useAccess } from '../../hooks/useAccess';

import '../../../styles/global.scss';
import './index.scss';
import { useMemo } from 'react';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';


const SectionSidebar = (props) => {

  const [access, readyAceess] = useAccess({
      key: '_SecurityAccesses',
      onLoaded: (data, isSuccess, error) => {
          if (!isSuccess) {
          ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
      }
  });

  const listMenuAccess = useMemo(() => {
    if (readyAceess) {
      return verify(props.listMenu);
    }
    else {
      return [];
    }
  }, [readyAceess, props.listMenu]);

  function verify(items) {
    let newItems = [];

    if (items) {
      items.forEach(item => {
        let verified = true;
        if (item.permisos) item.permisos.forEach(permiso => verified = verified && access.some(f => f.codigo === permiso));
        if (verified) {
          if (item.items) item.items = verify(item.items);
          newItems.push(item);
        }
      });
    }

    return newItems;
  }

  return (

      <ProSidebar
        collapsed={props.collapsed}
        onToggle={props.onToggleSidebar}
      >

        <SidebarContent>

          {listMenuAccess.map(m =>
              <Menu key={m.menu}>
                {m.items.map((item, index) =>

                  (item.items) ?
                    <SubMenu key={index} icon={(item.icon) ? <span className="material-symbols-outlined">{item.icon}</span> : null} title={item.title}>
                      {item.items.map((subitem, index) =>

                        (subitem.items) ?
                        <SubMenu key={index} icon={(subitem.icon) ? <span className="material-symbols-outlined">{subitem.icon}</span> : null} title={subitem.title}>
                          {subitem.items.map((subitem2, index) =>
                            <MenuItem key={index} icon={(subitem2.icon) ? <span className="material-symbols-outlined">{subitem2.icon}</span> : null}
                              onClick={() => (subitem2.onClick) ? subitem2.onClick() : {}}
                            >
                              {subitem2.title}
                            </MenuItem>  
                          )}
                        </SubMenu> :
                        <MenuItem key={index} icon={(subitem.icon) ? <span className="material-symbols-outlined">{subitem.icon}</span> : null}
                          onClick={() => (subitem.onClick) ? subitem.onClick() : {}}
                        >
                          {subitem.title}
                        </MenuItem>

                      )}
                    </SubMenu> :
                    <MenuItem key={index} icon={(item.icon) ? <span className="material-symbols-outlined">{item.icon}</span> : null}
                      onClick={() => (item.onClick) ? item.onClick() : {}}
                    >
                      {item.title}
                    </MenuItem>

                )}
              </Menu>
          )}

        </SidebarContent>

      </ProSidebar>

  )
}

SectionSidebar.propTypes = {
  collapsed: bool,
  onToggleSidebar: func,
  listMenu: array.isRequired
};

SectionSidebar.defaultProps = {
  collapsed: true,
  onToggleSidebar: null
};

export default SectionSidebar;
