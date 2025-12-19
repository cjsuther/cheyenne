import React, { useState, useEffect } from 'react';
import { object, func } from 'prop-types';
import DireccionForm from '../DireccionForm';


const DomicilioModal = (props) => {

  const entityInit = {
      id: 0,
      entidad: "",
      idEntidad: 0,
      idTipoGeoreferencia: 0,
      idPais: 0,
      idProvincia: 0,
      idLocalidad: 0,
      idZonaGeoreferencia: 0,
      codigoPostal: "",
      calle: "",
      entreCalle1: "",
      entreCalle2: "",
      altura: "",
      piso: "",
      dpto: "",
      referencia: "",
      longitud: 0,
      latitud: 0
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState, entity: props.data.entity };
    });
  }
  useEffect(mount, [props.data]);

  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-lg">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Doimicilio: {state.entity.domicilio}</h2>
          </div>
          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-12">
                  <DireccionForm
                    data={{
                      entity: state.entity
                    }}
                    disabled={true}
                  />
                </div>

            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

DomicilioModal.propTypes = {
  data: object.isRequired,
  onDismiss: func.isRequired,
};

export default DomicilioModal;