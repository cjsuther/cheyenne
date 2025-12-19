import React from 'react';
import { InputNumber } from '../../common';

const ParametroProcedimientoModal = (props) => {


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
                    <label htmlFor="tipoDato" className="form-label">Tipo de dato</label>
                    <select
                        name="tipoDato"
                        type="select"
                        placeholder=""
                        className="form-control"
                        value={ "" }
                        disabled={false}
                    >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    </select>
                    
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

export default ParametroProcedimientoModal;