import React from 'react'
import { bool, func, array } from 'prop-types';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
} from 'react-pro-sidebar';

import '../../../styles/global.scss';
import './index.scss';


const SectionSidebar = (props) => {


  return (

      <ProSidebar
        collapsed={props.collapsed}
        onToggle={props.onToggleSidebar}
      >

        <SidebarContent>

          {props.listMenu.map(m =>
              <Menu key={m.menu}>
                {m.items.map((item, index) =>

                  (item.items) ?
                    <SubMenu key={index} icon={(item.icon) ? <i className={item.icon}></i> : null} title={item.title}>
                      {item.items.map((subitem, index) =>

                        (subitem.items) ?
                        <SubMenu key={index} icon={(subitem.icon) ? <i className={subitem.icon}></i> : null} title={subitem.title}>
                          {subitem.items.map((subitem2, index) =>
                            <MenuItem key={index} icon={(subitem2.icon) ? <i className={subitem2.icon}></i> : null}
                              onClick={() => (subitem2.onClick) ? subitem2.onClick() : {}}
                            >
                              {subitem2.title}
                            </MenuItem>  
                          )}
                        </SubMenu> :
                        <MenuItem key={index} icon={(subitem.icon) ? <i className={subitem.icon}></i> : null}
                          onClick={() => (subitem.onClick) ? subitem.onClick() : {}}
                        >
                          {subitem.title}
                        </MenuItem>

                      )}
                    </SubMenu> :
                    <MenuItem key={index} icon={(item.icon) ? <i className={item.icon}></i> : null}
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
