import React from 'react';
import InputNumber from '../../common/InputNumber';



const PlanPagoDefinicionQuitaCuotaModal = (props) => {



  //hooks
  //handles
  //funciones


  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog">
            <div className="modal-content animated fadeIn">
            <div className="modal-header">
                <h2 className="modal-title">Definición quita cuota</h2>
            </div>
            <div className="modal-body">

                <div className="row">
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="cuotaDesde" className="form-label">Cuota desde</label>
                        <InputNumber
                            name="cuotaDesde"
                            placeholder=""
                            className="form-control"
                            value={ "2" }
                            precision={0}
                            disabled={ false }
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="cuotaHasta" className="form-label">Cuota hasta</label>
                        <InputNumber
                            name="cuotaHasta"
                            placeholder=""
                            className="form-control"
                            value={ "16" }
                            precision={0}
                            disabled={ false }
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="porcentajeQuitaRecargos" className="form-label">% Quita de recargos</label>
                        <InputNumber
                            name="porcentajeQuitaRecargos"
                            placeholder=""
                            className="form-control"
                            value={ "2.50%" }
                            precision={2}
                            disabled={ false }
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="porcentajeQuitaMultaInfracciones" className="form-label">% Quita de multas e infracciones</label>
                        <InputNumber
                            name="porcentajeQuitaMultaInfracciones"
                            placeholder=""
                            className="form-control"
                            value={ "" }
                            precision={2}
                            disabled={ false }
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="porcentajeQuitaHonorarios" className="form-label">% Quita de honorarios</label>
                        <InputNumber
                            name="porcentajeQuitaHonorarios"
                            placeholder=""
                            className="form-control"
                            value={ "" }
                            precision={2}
                            disabled={ false }
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="porcentajeQuitaAportes" className="form-label">% Quita de aportes</label>
                        <InputNumber
                            name="porcentajeQuitaAportes"
                            placeholder=""
                            className="form-control"
                            value={ "" }
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

export default PlanPagoDefinicionQuitaCuotaModal;