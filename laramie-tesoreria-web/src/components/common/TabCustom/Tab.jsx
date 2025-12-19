import React from 'react';
import './index.scss';

const Tab = (props) => {

    return (

        <div
          eventKey={props.eventKey}
          title={props.title}
          tabClassName={props.tabClassName}
        >
          {props.children}
        </div>

    )
  }
  
  export default Tab