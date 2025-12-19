import React from 'react';
import { InputLista, InputNumber } from '../../common';

const ProcedimientoVariableModal = (props) => {


  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-lg">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
           <h2 className="modal-title">Procedimiento Variable:</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="codigo" className="form-label">Código</label>
                    <input
                        name="codigo"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ "" }
                        disabled={false}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        name="nombre"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ "" }
                        disabled={false}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idTipoVariable" className="form-label">Tipo de variable</label>
                    <InputLista
                        name="idTipoVariable"
                        placeholder=""
                        className="form-control"
                        value={ "" }
                        lista="TipoVariable"
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="tipoDato" className="form-label">Tipo de dato</label>
                    <input
                        name="tipoDato"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ "" }
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idColeccionCampo" className="form-label">Colección / Campo</label>
                    <input
                        name="idColeccionCampo"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ "" }
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="orden" className="form-label">Orden</label>
                    <InputNumber
                        name="orden"
                        placeholder=""
                        className="form-control"
                        value={ "" }
                        precision={0}
                        disabled={false}
                    />
                </div>

            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-dismiss="modal">Aceptar</button>
            <button className="btn btn-outline-primary" data-dismiss="modal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

export default ProcedimientoVariableModal;