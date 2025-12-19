import React, { useMemo } from 'react'
import { func, array, bool } from 'prop-types';
import { Link, useSearchParams } from 'react-router-dom';

import { APPCONFIG } from '../../../app.config';
import { TextEllipsis } from '../'

import '../../../styles/global.scss';
import './index.scss';
import SidebarToggleButton from './components/SidebarToggleButton'

const SectionHeading = (props) => {
  const [searchParams] = useSearchParams()
  const titles = useMemo(() => [{ title: APPCONFIG.GENERAL.TITLE, url: '/' }, ...props.titles], [props.titles])

  if (searchParams.get("tempView")) return <></>
  else return (

    <div className={`section-heading hr-heading${props.onAddClick && !props.tableVisible ? 
        ' section-heading-with-add-btn' : ''}`}>
      <div className='row'>
        <div className='heading-subtitle'>
          {props.handleToggleSidebar && (
            <SidebarToggleButton onClick={props.handleToggleSidebar} isSidebarOpen={props.isSidebarOpen}/>
          )}
          {titles.map((title, index) => (
            <div key={index} className='navbar-title-container'>
              <Link to={title.url} className={`navbar-title${title.url ? ' navbar-title-link' : ''}`}>
                <TextEllipsis>{title.title ?? title}</TextEllipsis>
              </Link>
              {(index < titles.length - 1) && <div className="navbar-separator"> / </div>}
            </div>)
          )}
        </div>
        {props.onAddClick && !props.tableVisible && (
          <div onClick={props.onAddClick} className="link">
            <span className="material-symbols-outlined" title="Nuevo">add</span>
          </div>
        )}
      </div>
      <hr />
    </div>

  )
}

SectionHeading.propTypes = {
  titles: array.isRequired,
  handleToggleSidebar: func,
  isSidebarOpen: bool,
  onAddClick: func,
  tableVisible: bool,
};

SectionHeading.defaultProps = {
  titles: [],
  handleToggleSidebar: null,
  onAddClick: null,
  tableVisible: false,
};

export default SectionHeading;
