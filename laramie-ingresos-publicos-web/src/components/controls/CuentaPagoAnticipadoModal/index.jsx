import React, { useState, useEffect } from 'react';
import { DatePickerCustom, InputTasa, InputSubTasa, InputNumber, InputEjercicio } from '../../common';
import { useForm } from '../../hooks/useForm';
import { object, func } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { isValidNumber, OnKeyPress_validInteger } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import { getDateNow } from '../../../utils/convert';


const CuentaPagoAnticipadoModal = (props) => {

    const entityInit = {
      id: 0,
      idEmisionEjecucion: null,
      idEmisionConceptoResultado: null,
      idPlanPagoCuota: null,
      idCuentaPago: null,
      idCuenta: null,
      idTasa: 0,
      idSubTasa: 0,
      periodo: '',
      cuota: 0,
      importeNominal: 0,
      importeAccesorios: 0,
      importeRecargos: 0,
      importeMultas: 0,
      importeHonorarios: 0,
      importeAportes: 0,
      importeTotal: 0,
      importeNeto: 0,
      importeDescuento: 0,
      fechaVencimientoTermino: null,
      fechaCobro: null,
      idEdesurCliente: null,
      item: 0
    };

    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        rubrosComercio: []
    });

    const mount = () => {
        setState(prevState => {
            return {...prevState,
              entity: props.data.entity,
              rubrosComercio: props.data.rubrosComercio
            };
        });
    }
    useEffect(mount, [props.data]);

    const [ formValues, formHandle, , formSet ] = useForm({
        idTasa: 0,
        idSubTasa: 0,
        periodo: '',
        cuota: 0,
        importeTotal: 0,
        fechaVencimientoTermino: getDateNow(false)
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);
            row.idCuenta = state.idCuenta;
            row.idTasa = formValues.idTasa;
            row.idSubTasa = formValues.idSubTasa;
            row.periodo = formValues.periodo;
            row.cuota = parseInt(formValues.cuota);
            row.importeNominal = formValues.importeTotal;
            row.importeTotal = formValues.importeTotal;
            row.fechaVencimientoTermino = formValues.fechaVencimientoTermino;
            props.onConfirm(row);
        };
    };

    //funciones
    function isFormValid() {

        if (formValues.idTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tasa');
            return false;
        }
        if (formValues.idSubTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Sub Tasa');
            return false;
        }
        if (formValues.periodo.length <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el periodo');
            return false;
        }
        if (!isValidNumber(formValues.cuota, true)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar la cuota');
            return false;
        }
        if (!isValidNumber(formValues.importeTotal, true)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el importe');
            return false;
        }

        return true;
    }


  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-lg">
        <div className="modal-content animated fadeIn">

          <div className="modal-header">
            <h2 className="modal-title">Pago Anticipado</h2>
          </div>
          
          <div className="modal-body">
            <div className="row">
    
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idTasa" className="form-label">Tasa</label>
                    <InputTasa
                        name="idTasa"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTasa }
                        onChange={ formHandle }
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idSubTasa" className="form-label">Sub Tasa</label>
                    <InputSubTasa
                        name="idSubTasa"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idSubTasa }
                        onChange={ formHandle }
                        idTasa={formValues.idTasa}
                    />
                </div>
                <div className="mb-3 col-6 col-md-3">
                    <label htmlFor="periodo" className="form-label">Periodo</label>
                    <InputEjercicio
                        name="periodo"
                        placeholder=""
                        className="form-control"
                        value={ formValues.periodo }
                        onChange={ formHandle }
                    />
                </div>
                <div className="mb-3 col-6 col-md-3">
                    <label htmlFor="cuota" className="form-label">Cuota</label>
                    <input
                        name="cuota"
                        type="text"
                        placeholder=""
                        className="form-control align-right"
                        value={ formValues.cuota}
                        onChange={ formHandle }
                        onKeyPress={ OnKeyPress_validInteger }
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="importeTotal" className="form-label">Importe</label>
                    <InputNumber
                        name="importeTotal"
                        placeholder=""
                        className="form-control"
                        value={formValues.importeTotal }
                        precision={2}
                        onChange={ formHandle }
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fechaVencimientoTermino" className="form-label">Fecha Vencimiento</label>
                    <DatePickerCustom
                        name="fechaVencimientoTermino"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaVencimientoTermino }
                        disabled={true}
                    />
                </div>

            </div>
          </div>
          <div className="modal-footer">
            {!props.disabled &&
            <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() } >Aceptar</button>
            }
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

CuentaPagoAnticipadoModal.propTypes = {
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

export default CuentaPagoAnticipadoModal;
