import React, { useState, useEffect } from 'react';
import { DatePickerCustom, InputTasa, InputSubTasa, InputNumber, InputEjercicio, InputEntidad } from '../../common';
import { useForm } from '../../hooks/useForm';
import { object, func } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { isValidNumber, OnKeyPress_validInteger } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import { getDateNow } from '../../../utils/convert';


const CuentaDebitoCreditoModal = (props) => {

    const entityInit = {
      id: 0,
            idEmisionEjecucion: null,
      idEmisionCuentaCorrienteResultado: null,
      idPlanPago: null,
      idPlanPagoCuota: null,
                idCertificadoApremio: null,
      idCuenta: null,
            idTasa: 0,
            idSubTasa: 0,
            periodo: "",
            cuota: 0,
        codigoDelegacion: "",
        idTipoMovimiento: 0,
        numeroMovimiento: "",
    tasaCabecera: false,
        idTipoValor: 0,
            importeDebe: 0,
            importeHaber: 0,
        idLugarPago: 0,
        fechaOrigen: null,
        fechaMovimiento: null,
            fechaVencimiento1: null,
            fechaVencimiento2: null,
                cantidad: 0,
                idEdesurCliente: null,
        detalle: "",
      item: 0,
      idUsuarioRegistro: null,
      fechaRegistro: null
    };

    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        idTipoTributo: 0,
        imputacion: '',
        rubrosComercio: []
    });

    const mount = () => {
        setState(prevState => {
            return {...prevState,
                entity: props.data.entity,
                idTipoTributo: props.data.idTipoTributo,
                imputacion: props.data.imputacion,
                rubrosComercio: props.data.rubrosComercio
            };
        });
    }
    useEffect(mount, [props.data]);

    const [ formValues, formHandle, , formSet ] = useForm({
        idEmisionEjecucion: 0,
        idTasa: 0,
        idSubTasa: 0,
        periodo: '',
        cuota: 0,
        importeDebe: 0,
        importeHaber: 0,
        fechaVencimiento1: getDateNow(false),
        fechaVencimiento2: getDateNow(false)
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);
            row.idCuenta = state.idCuenta;
            row.idEmisionEjecucion = formValues.idEmisionEjecucion;
            row.idTasa = formValues.idTasa;
            row.idSubTasa = formValues.idSubTasa;
            row.periodo = formValues.periodo;
            row.cuota = parseInt(formValues.cuota);
            row.importeDebe = formValues.importeDebe;
            row.importeHaber = formValues.importeHaber;
            row.fechaVencimiento1 = formValues.fechaVencimiento1;
            row.fechaVencimiento2 = formValues.fechaVencimiento2;
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
        if (state.imputacion === 'D' && !isValidNumber(formValues.importeDebe, true)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el importe');
            return false;
        }
        if (state.imputacion === 'H' && !isValidNumber(formValues.importeHaber, true)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el importe');
            return false;
        }
        if (formValues.fechaVencimiento1 === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar la fecha de vencimiento');
            return false;
        }
        if (formValues.fechaVencimiento2 === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar la fecha de cálculo con recargo');
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
            <h2 className="modal-title">Débito / Crédito</h2>
          </div>
          
          <div className="modal-body">
            <div className="row">
    
                <div className="mb-3 col-12">
                    <label htmlFor="idEmisionEjecucion" className="form-label">Emisión</label>
                    <InputEntidad
                        name="idEmisionEjecucion"
                        title="Emisiones"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idEmisionEjecucion }
                        onChange={ formHandle }
                        entidad="EmisionEjecucion"
                        onFormat={(row) => (row && row.id) ? `${row.numero} - ${row.descripcion}` : ''}
                        columns={[
                            { Header: 'Número', accessor: 'numero', width: '20%' },
                            { Header: 'Descripción', accessor: 'descripcion', width: '80%' },
                        ]}
                        // filter={(row) => {return (row.idTipoTributo === state.idTipoTributo)}}
                        memo={false}
                    />
                </div>
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
                {state.imputacion === "D" &&
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="importeDebe" className="form-label">Importe Debe</label>
                    <InputNumber
                        name="importeDebe"
                        placeholder=""
                        className="form-control"
                        value={formValues.importeDebe }
                        precision={2}
                        onChange={ formHandle }
                    />
                </div>
                }
                {state.imputacion === "H" &&
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="importeHaber" className="form-label">Importe Haber</label>
                    <InputNumber
                        name="importeHaber"
                        placeholder=""
                        className="form-control"
                        value={formValues.importeHaber }
                        precision={2}
                        onChange={ formHandle }
                    />
                </div>
                }
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fechaVencimiento1" className="form-label">Fecha Vencimiento</label>
                    <DatePickerCustom
                        name="fechaVencimiento1"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaVencimiento1 }
                        onChange={ formHandle }
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="fechaVencimiento2" className="form-label">Fecha Cálculo/Recargo</label>
                    <DatePickerCustom
                        name="fechaVencimiento2"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaVencimiento2 }
                        onChange={ formHandle }
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

CuentaDebitoCreditoModal.propTypes = {
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

export default CuentaDebitoCreditoModal;
