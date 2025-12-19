import React from 'react';
import { func, string } from 'prop-types';


const MessageModal = (props) => {

  return (

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h5 className="modal-title">{props.title}</h5>
            <i className={`modal-icon ${props.icon}`}></i>
          </div>
          <div className="modal-body">
            <p>{props.message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => props.onConfirm() }>Aceptar</button>
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

  );
}

MessageModal.propTypes = {
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
  message: string,
  title: string,
  icon: string
};

MessageModal.defaultProps = {
  message: "",
  title: "",
  icon: 'fa fa-exclamation-circle'
};

export default MessageModal;