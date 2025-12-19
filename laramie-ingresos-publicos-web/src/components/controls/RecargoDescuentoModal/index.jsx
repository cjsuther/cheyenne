import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { object, func, bool, string } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import { isEmptyString, isValidNumber } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import { DatePickerCustom, InputNumber, InputEntidad, InputPersona, InputExpediente, InputTasa, InputSubTasa } from '../../common';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import InputEjercicio from '../../common/InputEjercicio';


const RecargoDescuentoModal = (props) => {

    //variables
    const entityInit = {
            id: 0,
            idCuenta: 0,
            idTipoRecargoDescuento: 0,
            idTasa: 0,
            idSubTasa: 0,
            idRubro: 0,
            fechaDesde: null,
            fechaHasta: null,
            fechaOtorgamiento: null,
            numeroSolicitud: '',
            porcentaje: 0,
            importe: 0,
            checkPorcentaje: false,
            checkImporte: false,
            idTipoPersona: 0,
            idPersona: 0,
            nombrePersona: '',
            numeroDocumento: '',
            idTipoDocumento: 0,
            numeroDDJJ: '',
            letraDDJJ: '',
            ejercicioDDJJ: '',
            numeroDecreto: '',
            letraDecreto: '',
            ejercicioDecreto: '',
            idExpediente: 0,
            detalleExpediente: ''
    };

    //hooks
    const [state, setState] = useState({
            entity: entityInit,
            idTipoTributo: 0,
            showInfo: false,
            accordions: {
                declaracionJurada: true,
                decreto: false,
                expediente: false
            }
    });

    const [persona, setPersona] = useState({
        idTipoPersona: 0,
        nombrePersona: "",
        numeroDocumento: "",
        idTipoDocumento: 0  
    });

    const [expediente, setExpediente] = useState({
        detalleExpediente: ""
    });

    const [tipoRecargoDescuento, setTipoRecargoDescuento] = useState({
        idTipoRecargoDescuento: 0,
        requiereOtrogamiento:  false,
        porcentaje: 0,
        importe: 0
    });

    const [ formValues, formHandle, , formSet ] = useForm({
        idTipoRecargoDescuento: 0,
        idTasa: 0,
        idSubTasa: 0,
        idRubro: 0,
        fechaDesde: null,
        fechaHasta: null,
        fechaOtorgamiento: null,
        numeroSolicitud: '',
        porcentaje: 0,
        importe: 0,
        checkPorcentaje: true,
        checkImporte: false,
        idPersona: 0,
        numeroDDJJ: '',
        letraDDJJ: '',
        ejercicioDDJJ: '',
        numeroDecreto: '',
        letraDecreto: '',
        ejercicioDecreto: '',
        idExpediente: 0
    });

    const mount = () => {
        setState(prevState => {
            return {...prevState, entity: props.data.entity, idTipoTributo: props.data.idTipoTributo };
        });
        formSet({
            idTipoRecargoDescuento: props.data.entity.idTipoRecargoDescuento,
            idTasa: props.data.entity.idTasa,
            idSubTasa: props.data.entity.idSubTasa,
            idRubro: props.data.entity.idRubro,
            fechaDesde: props.data.entity.fechaDesde,
            fechaHasta: props.data.entity.fechaHasta,
            fechaOtorgamiento: props.data.entity.fechaOtorgamiento,
            numeroSolicitud: props.data.entity.numeroSolicitud,
            porcentaje: props.data.entity.porcentaje,
            importe: props.data.entity.importe,
            checkPorcentaje: (props.data.entity.importe === 0),
            checkImporte: (props.data.entity.importe > 0),
            idPersona: props.data.entity.idPersona,
            numeroDDJJ: props.data.entity.numeroDDJJ,
            letraDDJJ: props.data.entity.letraDDJJ,
            ejercicioDDJJ: props.data.entity.ejercicioDDJJ,
            numeroDecreto: props.data.entity.numeroDecreto,
            letraDecreto: props.data.entity.letraDecreto,
            ejercicioDecreto: props.data.entity.ejercicioDecreto,
            idExpediente: props.data.entity.idExpediente
        });
        setPersona({
            idTipoPersona: props.data.entity.idTipoPersona,
            nombrePersona: props.data.entity.nombrePersona,
            numeroDocumento: props.data.entity.numeroDocumento,
            idTipoDocumento: props.data.entity.idTipoDocumento
        });
        setExpediente({
          detalleExpediente: props.data.entity.detalleExpediente
        });

    }
    useEffect(mount, [props.data.entity]);

    const [, getRowEntidad] = useEntidad({
        entidades: ['TipoRecargoDescuento'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoRecargoDescuento',
          timeout: 0
        }
      });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);

            row.idTipoRecargoDescuento = parseInt(formValues.idTipoRecargoDescuento);
            row.idTasa = parseInt(formValues.idTasa);
            row.idSubTasa = parseInt(formValues.idSubTasa);
            row.idRubro = !isEmptyString(formValues.idPersona) ? parseInt(formValues.idRubro) : 0;
            row.fechaDesde = formValues.fechaDesde;
            row.fechaHasta = formValues.fechaHasta;
            row.fechaOtorgamiento = formValues.fechaOtorgamiento;
            row.numeroSolicitud = formValues.numeroSolicitud;
            row.porcentaje = formValues.porcentaje;
            row.importe = formValues.importe;
            row.idPersona = parseInt(formValues.idPersona);
            row.idTipoPersona = persona.idTipoPersona;
            row.nombrePersona = persona.nombrePersona;
            row.numeroDocumento = persona.numeroDocumento;
            row.idTipoDocumento = persona.idTipoDocumento;
            row.numeroDDJJ = formValues.numeroDDJJ;
            row.letraDDJJ = formValues.letraDDJJ;
            row.ejercicioDDJJ = formValues.ejercicioDDJJ;
            row.numeroDecreto = formValues.numeroDecreto;
            row.letraDecreto = formValues.letraDecreto;
            row.ejercicioDecreto = formValues.ejercicioDecreto;
            row.idExpediente = !isEmptyString(formValues.idExpediente) ? parseInt(formValues.idExpediente) : 0;
            row.detalleExpediente = expediente.detalleExpediente;
            
            props.onConfirm(row);
        };
    };

    //funciones
    function isFormValid() {

        if (formValues.idTipoRecargoDescuento <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tipo');
            return false;
        }
        if (formValues.idTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tasa');
            return false;
        }
        if (formValues.idSubTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Sub Tasa');
            return false;
        }
        if (formValues.fechaDesde == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Fecha Desde');
            return false;
        }
        if (formValues.fechaHasta == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Fecha Hasta');
            return false;
        }
        if (formValues.checkPorcentaje && (!isValidNumber(formValues.porcentaje, false) || formValues.porcentaje === 0)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Porcentaje');
            return false;
        }
        if (formValues.checkImporte && (!isValidNumber(formValues.importe, false) || formValues.importe === 0)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Importe');
            return false;
        }
        if (formValues.idPersona <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Solicitante');
            return false;
        }

        if (tipoRecargoDescuento.requiereOtrogamiento && isEmptyString(expediente.detalleExpediente)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El tipo de Recargo/Descuento requiere otorgamiento. Debe seleccionar un expediente');
            return false;
        }

        return true;
    }

    const getDescTipoRecargoDescuento = (id) => {
        const row = getRowEntidad('TipoRecargoDescuento', id);
        return (row) ? row.nombre : '';
    }

    function ToggleAccordion(accordion) {
        let accordions = CloneObject(state.accordions);
        accordions[accordion] = !accordions[accordion];
        setState(prevState => {
            return {...prevState, accordions: accordions};
        });
    }

    function ToggleAccordionInfo() {
        setState(prevState => {
            return {...prevState, showInfo: !prevState.showInfo};
        });
    }

    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i>

  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-dialog-size">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Recargo/Descuento: {(state.entity.id > 0) ? getDescTipoRecargoDescuento(state.entity.idTipoRecargoDescuento) : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-6">
                    <label htmlFor="idTipoRecargoDescuento" className="form-label">Tipo</label>
                    <InputEntidad
                        name="idTipoRecargoDescuento"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoRecargoDescuento }
                        onUpdate={({target}) => {
                            const tipoRecargoDescuento = (target.row) ? {
                                idTipoRecargoDescuento: target.row.id,
                                requiereOtrogamiento:  target.row.requiereOtrogamiento,
                                porcentaje: target.row.porcentaje,
                                importe: target.row.importe
                            } : {
                                idTipoRecargoDescuento: 0,
                                requiereOtrogamiento:  false,
                                porcentaje: 0,
                                importe: 0
                            };
                            setTipoRecargoDescuento(tipoRecargoDescuento);
                        }}
                        onChange={({target}) => {
                            if (target.row) {
                                formSet({...formValues,
                                    idTipoRecargoDescuento: target.row.id,
                                    importe: target.row.importe,
                                    porcentaje: target.row.porcentaje,
                                    checkImporte: (target.row.importe !== 0 && target.row.porcentaje === 0),
                                    checkPorcentaje: (target.row.importe === 0 && target.row.porcentaje !== 0),
                                });
                            }
                            else {
                                formSet({...formValues,
                                    idTipoRecargoDescuento: 0,
                                    importe: 0,
                                    porcentaje: 0,
                                    checkImporte: false,
                                    checkPorcentaje: false
                                });
                            }
                        }}
                        disabled={props.disabled}
                        title="Tipo Recargo Descuento"
                        entidad="TipoRecargoDescuento"
                        filter={row => row.idTipoTributo === state.idTipoTributo}
                    />
                </div>

                <div className="mb-3 col-6">
                    <label htmlFor="idTasa" className="form-label">Tasa</label>
                    <InputTasa
                        name="idTasa"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTasa }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>

                <div className="mb-3 col-6">
                    <label htmlFor="idSubTasa" className="form-label">Sub tasa</label>
                    <InputSubTasa
                        name="idSubTasa"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idSubTasa }
                        onChange={ formHandle }
                        disabled={ props.disabled}
                        idTasa={formValues.idTasa}
                    />
                </div> 

                <div className="mb-3 col-6">
                    <label htmlFor="idRubro" className="form-label">Rubro</label>
                    <InputEntidad
                        name="idRubro"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idRubro }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        title="Rubro"
                        entidad="Rubro"
                    />
                </div>   
                
                <div className="mb-3 col-4">
                    <label htmlFor="fechaDesde" className="form-label">Fecha Desde</label>
                    <DatePickerCustom
                        name="fechaDesde"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaDesde }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>

                <div className="mb-3 col-4">
                    <label htmlFor="fechaHasta" className="form-label">Fecha Hasta</label>
                    <DatePickerCustom
                        name="fechaHasta"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaHasta }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        minValue={formValues.fechaDesde}
                    />
                </div>

                <div className="mb-3 col-4">
                    <label htmlFor="fechaOtorgamiento" className="form-label">Fecha Otorgamiento</label>
                    <DatePickerCustom
                        name="fechaOtorgamiento"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaOtorgamiento }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                
                <div className="mb-3 col-4">
                    <label htmlFor="numeroSolicitud" className="form-label">Número de Solicitud</label>
                    <input
                        name="numeroSolicitud"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.numeroSolicitud }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                
                <div className="mb-3 col-4">
                    <input
                        name="checkPorcentaje"
                        type="checkbox"
                        value={''}
                        checked= { formValues.checkPorcentaje }
                        onChange={({target}) => {
                            formSet({...formValues,
                                checkImporte: !formValues.checkImporte,
                                checkPorcentaje: formValues.checkImporte,
                                importe: 0,
                                porcentaje: 0
                            });
                        }}
                        className="form-check-input"
                        disabled={props.disabled}
                    />
                    <label htmlFor="porcentaje" className="form-label m-left-10">Porcentaje</label>
                    <InputNumber
                        name="porcentaje"
                        placeholder=""
                        className="form-control"
                        value={ formValues.porcentaje }
                        precision={2}
                        allowNegative={true}
                        onChange={ formHandle }
                        validation={(value => {
                            return (value >= -100 && value <= 100);
                        })}
                        disabled={props.disabled || formValues.checkImporte}
                    />
                </div>

                <div className="mb-3 col-4 ">
                    <input
                        name="checkImporte"
                        type="checkbox"
                        className="form-check-input"
                        value={''}
                        checked= { formValues.checkImporte }
                        onChange={({target}) => {
                            formSet({...formValues,
                                checkImporte: !formValues.checkImporte,
                                checkPorcentaje: formValues.checkImporte,
                                importe: 0,
                                porcentaje: 0
                            });
                        }}
                        disabled={props.disabled}
                    />
                    <label htmlFor="importe" className="form-label m-left-10">Importe</label>
                    <InputNumber
                        name="importe"
                        placeholder=""
                        className="form-control"
                        value={ formValues.importe }
                        precision={2}
                        allowNegative={true}
                        onChange={ formHandle }
                        disabled={props.disabled || formValues.checkPorcentaje}
                    />
                </div>

                <div className="mb-3 col-12">
                    <label htmlFor="idPersona" className="form-label">Solicitante</label>
                    <InputPersona
                        name="idPersona"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idPersona }
                        idTipoPersona={0}
                        onChange={(event) => {
                          const {target} = event;
                          const persona = (target.row) ? {
                            idTipoPersona: target.row.idTipoPersona,
                            idTipoDocumento: target.row.idTipoDocumento,
                            numeroDocumento: target.row.numeroDocumento,
                            nombrePersona: target.row.nombrePersona
                          } : {
                            idTipoPersona: 0,
                            idTipoDocumento: 0,
                            numeroDocumento: "",
                            nombrePersona: ""
                          };
                          setPersona(persona);
                          formHandle(event);
                        }}
                        disabled={props.disabled}
                    />
                </div>

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('declaracionJurada')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.declaracionJurada) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.declaracionJurada ? 'active' : ''}>Declaración jurada</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.declaracionJurada &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="col-6 col-md-4">
                                <label htmlFor="numeroDDJJ" className="form-label">Número</label>
                                <input
                                    name="numeroDDJJ"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.numeroDDJJ }
                                    onChange={ formHandle }            
                                    disabled={props.disabled}
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <label htmlFor="letraDDJJ" className="form-label">Letra</label>
                                <input
                                    name="letraDDJJ"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.letraDDJJ }
                                    onChange={ formHandle }            
                                    disabled={props.disabled}
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <label htmlFor="ejercicioDDJJ" className="form-label">Año</label>
                                <InputEjercicio
                                    name="ejercicioDDJJ"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.ejercicioDDJJ }
                                    onChange={ formHandle }
                                    disabled={props.disabled}
                                />
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                
                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('decreto')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.decreto) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.decreto ? 'active' : ''}>Decreto/Ordenanza</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.decreto &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="col-6 col-md-4">
                                <label htmlFor="numeroDecreto" className="form-label">Número</label>
                                <input
                                    name="numeroDecreto"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.numeroDecreto }
                                    onChange={ formHandle }            
                                    disabled={props.disabled}
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <label htmlFor="letraDecreto" className="form-label">Letra</label>
                                <input
                                    name="letraDecreto"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.letraDecreto }
                                    onChange={ formHandle }            
                                    disabled={props.disabled}
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <label htmlFor="ejercicioDecreto" className="form-label">Año</label>
                                <InputEjercicio
                                    name="ejercicioDecreto"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.ejercicioDecreto }
                                    onChange={ formHandle }
                                    disabled={props.disabled}
                                />
                            </div>
                        </div>
                    </div>
                    )}
                </div>

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('expediente')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.expediente) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.expediente ? 'active' : ''}>Expediente</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.expediente &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="col-12">
                                <label htmlFor="idExpediente" className="form-label">Expediente</label>
                                <InputExpediente
                                    name="idExpediente"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idExpediente }
                                    onChange={(event) => {
                                        const {target} = event;
                                        const expediente = (target.row) ? {
                                            detalleExpediente: target.row.detalleExpediente,
                                        } : {
                                            detalleExpediente: ""
                                        };
                                        setExpediente(expediente);
                                        formHandle(event);
                                    }}
                                    disabled={props.disabled}
                                />
                            </div>
                        </div>
                    </div>
                    )}
                </div>

                <div className="mb-3 col-12">
                  <div className='accordion-header'>
                    <div className='row'>
                      <div className="col-12" onClick={() => ToggleAccordionInfo()}>
                        <div className='accordion-header-title'>
                          {(state.showInfo) ? accordionOpen : accordionClose}
                          <h3 className={state.showInfo ? 'active' : ''}>Información adicional</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {state.showInfo &&
                  <div className='accordion-body'>
                    <DataTaggerFormRedux
                        title="Información adicional de Recargo/Descuento"
                        processKey={props.processKey}
                        entidad="RecargoDescuento"
                        idEntidad={state.entity.id}
                        disabled={props.disabled}
                    />
                  </div>
                  }
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

RecargoDescuentoModal.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};
  
RecargoDescuentoModal.defaultProps = {
    disabled: false
};

export default RecargoDescuentoModal;
