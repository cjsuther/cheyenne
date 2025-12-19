import React, { useMemo } from 'react'
import {element, func, array, bool} from 'prop-types';
import { Link } from 'react-router-dom';

import '../../../styles/global.scss';
import './index.scss';
import { APPCONFIG } from '../../../app.config';

const SectionHeading = (props) => {

  const titles = useMemo(() => [{ title: APPCONFIG.GENERAL.TITLE, url: '/' }, ...props.titles], [props.titles])

  return (

    <div className={`section-heading hr-heading${props.onAddClick && !props.tableVisible ?
        ' section-heading-with-add-btn' : ''}`}>
      <div className='row'>
        <div className='heading-subtitle'>
          {props.handleToggleSidebar && (
          <span className="material-symbols-outlined link" onClick={() => (props.handleToggleSidebar) ? props.handleToggleSidebar() : {}}>menu</span>
          )}
          {titles.map((title, index) => (
            <div key={index} className='navbar-title-container'>
              <Link to={title.url} className={`navbar-title ${title.url ? 'navbar-title-link' : ''}`}>
                {title.title ?? title}
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
