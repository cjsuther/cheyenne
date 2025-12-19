import React from 'react';
import InputNumber from '../../common/InputNumber';



const PlanPagoDefinicionInteresModal = (props) => {



  //hooks
  //handles
  //funciones


  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog">
            <div className="modal-content animated fadeIn">
            <div className="modal-header">
                <h2 className="modal-title">Definición de Interés</h2>
            </div>
            <div className="modal-body">

                <div className="row">
                    <div className="mb-3 col-6 col-md-6">
                        <label htmlFor="cuotaDesde" className="form-label">Cuota desde</label>
                        <InputNumber
                            name="cuotaDesde"
                            placeholder=""
                            className="form-control"
                            value={0}
                            precision={0}
                            disabled={ false }
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-6">
                        <label htmlFor="cuotaHasta" className="form-label">Cuota hasta</label>
                        <InputNumber
                            name="cuotaHasta"
                            placeholder=""
                            className="form-control"
                            value={0}
                            precision={0}
                            disabled={ false }
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-6">
                        <label htmlFor="porcentajeInteres" className="form-label">Interés mensual (%)</label>
                        <InputNumber
                            name="porcentajeInteres"
                            placeholder=""
                            className="form-control"
                            value={0}
                            precision={2}
                            disabled={ false }
                        />
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn btn-primary" data-dismiss="modal" >Aceptar</button>
                <button className="btn btn-outline-primary" data-dismiss="modal">Cancelar</button>
            </div>
            </div>
        </div>
    </div>

    </>
  );
}

export default PlanPagoDefinicionInteresModal;