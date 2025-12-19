import React from 'react';
import { func, string } from 'prop-types';


const MessageModal = (props) => {

  return (

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h5 className="modal-title">{props.title}</h5>
            <span className="modal-icon material-symbols-outlined">error</span>
          </div>
          <div className="modal-body">
            <p>{props.message}</p>
          </div>
          {!props.disabled &&
            <div className="modal-footer">
              <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
              <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => props.onConfirm() }>Aceptar</button>
            </div>
            }
            
            {props.disabled &&
            <div className="modal-footer f-align">
              <button className="btn back-button" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Volver</button>
            </div>
            }
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
  icon: ''
};

export default MessageModal;