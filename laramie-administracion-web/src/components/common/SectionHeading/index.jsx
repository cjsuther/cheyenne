import React from 'react'
import { element, func } from 'prop-types';
import { Link } from 'react-router-dom';

import '../../../styles/global.scss';


const SectionHeading = (props) => {
 
  return (

    <div className='section-heading hr-heading'>
      <div className='row'>

        <div className='col-6'>
          <div className='heading-subtitle'>
            {props.handleToggleSidebar && (
            <i className='fa fa-bars fa-lg link' onClick={() => (props.handleToggleSidebar) ? props.handleToggleSidebar() : {}}></i>
            )}
            <h2>{props.title}</h2>
          </div>
        </div>
        <div className='col-6'>
          <div className='heading-modulo'>
            <Link to="/" className="navbar-brand">Administración</Link>
          </div>
        </div>

      </div>
      <hr />
    </div>

  )
}

SectionHeading.propTypes = {
  title: element.isRequired,
  handleToggleSidebar: func
};

SectionHeading.defaultProps = {
  handleToggleSidebar: null
};

export default SectionHeading;
