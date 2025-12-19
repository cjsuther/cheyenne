import React, { useState, useEffect } from 'react';
import InputEntidad from '../../common/InputEntidad';
import DatePickerCustom from '../../common/DatePickerCustom';
import { useForm } from '../../hooks/useForm';
import { object, func, bool, string } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerFormRedux from '../DataTaggerFormRedux';

const RubroComercioModal = (props) => {

  const entityInit = {
    id: 0,
    idComercio: 0,
    idTipoRubroComercio: 0,
    idUbicacionComercio: 0,
    idRubroLiquidacion: 0,
    idRubroProvincia: 0,
    idRubroBCRA: 0,
    descripcion: '',
    esDeOficio: false,
    esRubroPrincipal: false,
    esConDDJJ: false,
    fechaInicio: null,
    fechaCese: null,
    fechaAltaTransitoria: null,
    fechaBajaTransitoria: null,
    fechaBaja: null,
    idMotivoBajaRubroComercio: 0
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    showInfo: false,
    accordions: {
      datosRubro: true,
      datosAdministrativos: false,
      informacionBaja: false
    }
  });

  const [tipoRubroComercioState, setTipoRubroComercioState] = useState({
        categoria: '',
        esGenerico: false,
        esFacturable: false,
        esRegimenGeneral: true
  });

  const [isFirstRubroState, setIsFirstRubroState] = useState(false);

  const mount = () => {
    setState(prevState => {
      return {...prevState, entity: props.data.entity };
    });

    formSet({
      idTipoRubroComercio: props.data.entity.idTipoRubroComercio,
      idUbicacionComercio: props.data.entity.idUbicacionComercio,
      idRubroLiquidacion: props.data.entity.idRubroLiquidacion,
      idRubroProvincia: props.data.entity.idRubroProvincia,
      idRubroBCRA: props.data.entity.idRubroBCRA,
      descripcion: props.data.entity.descripcion,
      esDeOficio: props.data.entity.esDeOficio,
      esRubroPrincipal: props.data.entity.esRubroPrincipal || props.data.isFirstRubro,
      esConDDJJ: props.data.entity.esConDDJJ,
      fechaInicio: props.data.entity.fechaInicio,
      fechaCese: props.data.entity.fechaCese,
      fechaAltaTransitoria: props.data.entity.fechaAltaTransitoria,
      fechaBajaTransitoria: props.data.entity.fechaBajaTransitoria,
      fechaBaja: props.data.entity.fechaBaja,
      idMotivoBajaRubroComercio: props.data.entity.idMotivoBajaRubroComercio,
    });

    setIsFirstRubroState(props.data.isFirstRubro);
 }

  useEffect(mount, [props.data.entity]);
    
  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoRubroComercio: 0,
    idUbicacionComercio: 0,
    idRubroLiquidacion: 0,
    idRubroProvincia: 0,
    idRubroBCRA: 0,
    descripcion: '',
    esDeOficio: false,
    esRubroPrincipal: false,
    esConDDJJ: false,
    fechaInicio: null,
    fechaCese: null,
    fechaAltaTransitoria: null,
    fechaBajaTransitoria: null,
    fechaBaja: null,
    idMotivoBajaRubroComercio: 0
  });


  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {
      let row = CloneObject(state.entity);
      row.idTipoRubroComercio = parseInt(formValues.idTipoRubroComercio);
      row.idUbicacionComercio = parseInt(formValues.idUbicacionComercio);
      row.idRubroLiquidacion = parseInt(formValues.idRubroLiquidacion);
      row.idRubroProvincia = parseInt(formValues.idRubroProvincia);
      row.idRubroBCRA = parseInt(formValues.idRubroBCRA);
      row.descripcion = formValues.descripcion;
      row.esDeOficio = formValues.esDeOficio;
      row.esRubroPrincipal = formValues.esRubroPrincipal;
      row.esConDDJJ = formValues.esConDDJJ;
      row.fechaInicio = formValues.fechaInicio;
      row.fechaCese = formValues.fechaCese;
      row.fechaAltaTransitoria = formValues.fechaAltaTransitoria;
      row.fechaBajaTransitoria = formValues.fechaBajaTransitoria;
      row.fechaBaja = formValues.fechaBaja;
      row.idMotivoBajaRubroComercio = parseInt(formValues.idMotivoBajaRubroComercio);

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTipoRubroComercio <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de rubro');
      return false;
    }
    if (formValues.idUbicacionComercio <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Ubicacion');
      return false;
    }
    if (formValues.idRubroLiquidacion <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Rubro liquidación');
      return false;
    }
    if (formValues.idRubroProvincia <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Rubro provincia');
      return false;
    }
    if (formValues.idRubroBCRA <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Rubro BCRA');
      return false;
    }
    if (formValues.descripcion == '') {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Descripción');
      return false;
    }

    return true;
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
      <div className="modal-dialog modal-xl">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Rubro Comercio: {(state.entity.id > 0) ? state.entity.descripcion : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('datosRubro')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.datosRubro) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.datosRubro ? 'active' : ''}>Datos del rubro</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.datosRubro &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="col-12 col-md-9">
                                <label htmlFor="idTipoRubroComercio" className="form-label">Tipo de rubro</label>
                                <InputEntidad
                                    name="idTipoRubroComercio"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idTipoRubroComercio }
                                    onChange={ formHandle }
                                    onUpdate={ (event) => {
                                        if (event.target.row){
                                            setTipoRubroComercioState( prevState => {
                                                return {
                                                    ...prevState,
                                                    categoria: event.target.row.categoria,
                                                    esGenerico: event.target.row.generico,
                                                    esFacturable: event.target.row.facturable,
                                                    esRegimenGeneral: event.target.row.regimenGeneral
                                                }
                                            })
                                        }
                                    }}
                                    disabled={ props.disabled }
                                    title="Tipo Rubro Comercio"
                                    entidad="TipoRubroComercio"
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <label htmlFor="categoria" className="form-label">Categoría</label>
                                <input
                                    name="categoria"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ tipoRubroComercioState.categoria }        
                                    disabled={true}
                                />
                            </div>
                            <div className="col-6 col-md-2 col-xl-2 form-check">
                                <label htmlFor="esGenerico" className="form-label">Genérico</label>
                                <input
                                    name="esGenerico"
                                    type="checkbox"
                                    className="form-check-input"
                                    value={''}
                                    checked= { tipoRubroComercioState.esGenerico }
                                    disabled={true}
                                />
                            </div>
                            <div className="col-6 col-md-2 col-lg-2 form-check">
                                <label htmlFor="esFacturable" className="form-label">Facturable</label>
                                <input
                                    name="esFacturable"
                                    type="checkbox"
                                    className="form-check-input"
                                    value={''}
                                    checked= { tipoRubroComercioState.esFacturable }
                                    disabled={true}
                                />
                            </div>
                            <div className="col-6 col-md-2 col-lg-2 form-check">
                                <label htmlFor="esRegimenGeneral" className="form-label">Régimen General</label>
                                <input
                                    name="esRegimenGeneral"
                                    type="checkbox"
                                    className="form-check-input"
                                    value={''}
                                    checked= { tipoRubroComercioState.esRegimenGeneral }
                                    disabled={true}
                                />
                            </div>

                        </div>
                    </div>
                    )}
                </div>

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('datosAdministrativos')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.datosAdministrativos) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.datosAdministrativos ? 'active' : ''}>Datos administrativos</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.datosAdministrativos &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="col-12 col-md-6">
                                <label htmlFor="idUbicacionComercio" className="form-label">Ubicación</label>
                                <InputEntidad
                                    name="idUbicacionComercio"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idUbicacionComercio }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                    title="Ubicacion Comercio"
                                    entidad="UbicacionComercio"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="idRubroLiquidacion" className="form-label">Rubros liquidación</label>
                                <InputEntidad
                                    name="idRubroLiquidacion"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idRubroLiquidacion }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                    title="Rubro Liquidacion"
                                    entidad="RubroLiquidacion"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="idRubroProvincia" className="form-label">Rubros provincia</label>
                                <InputEntidad
                                    name="idRubroProvincia"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idRubroProvincia }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                    title="Rubro Provincia"
                                    entidad="RubroProvincia"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="idRubroBCRA" className="form-label">Rubros BCRA</label>
                                <InputEntidad
                                    name="idRubroBCRA"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idRubroBCRA }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                    title="Rubro BCRA"
                                    entidad="RubroBCRA"
                                />
                            </div>
                            <div className="col-12 col-md-12">
                                <label htmlFor="descripcion" className="form-label">Descripción</label>
                                <input
                                    name="descripcion"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.descripcion }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                />
                            </div>
                            <div className="col-4 col-md-3 col-lg-3 form-check">
                                <label htmlFor="esDeOficio" className="form-check-label">De oficio</label>
                                <input
                                    name="esDeOficio"
                                    type="checkbox"
                                    className="form-check-input"
                                    value={''}
                                    checked={formValues.esDeOficio }
                                    onChange={ formHandle }
                                    disabled={props.disabled}
                                />
                            </div>
                            <div className="col-4 col-md-3 col-lg-3 form-check">
                                <label htmlFor="esRubroPrincipal" className="form-check-label">Rubro principal</label>
                                <input
                                    name="esRubroPrincipal"
                                    type="checkbox"
                                    className="form-check-input"
                                    value={''}
                                    checked={formValues.esRubroPrincipal }
                                    onChange={ formHandle }
                                    disabled={ isFirstRubroState || props.disabled }
                                />
                            </div>
                            <div className="col-4 col-md-4 col-lg-4 form-check">
                                <label htmlFor="esConDDJJ" className="form-check-label">Con DDJJ</label>
                                <input
                                    name="esConDDJJ"
                                    type="checkbox"
                                    className="form-check-input"
                                    value={''}
                                    checked={formValues.esConDDJJ }
                                    onChange={ formHandle }
                                    disabled={props.disabled}
                                />
                            </div>
                            <div className="col-6 col-md-3 col-lg-3">
                                <label htmlFor="fechaInicio" className="form-label">Fecha Inicio</label>
                                <DatePickerCustom
                                    name="fechaInicio"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.fechaInicio }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                />
                            </div>
                            <div className="col-6 col-md-3 col-lg-3">
                                <label htmlFor="fechaCese" className="form-label">Fecha Cese</label>
                                <DatePickerCustom
                                    name="fechaCese"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.fechaCese }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                />
                            </div>
                            <div className="col-6 col-md-3 col-lg-3">
                                <label htmlFor="fechaAltaTransitoria" className="form-label">Alta transitoria</label>
                                <DatePickerCustom
                                    name="fechaAltaTransitoria"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.fechaAltaTransitoria }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                />
                            </div>
                            <div className="col-6 col-md-3 col-lg-3">
                                <label htmlFor="fechaBajaTransitoria" className="form-label">Baja transitoria</label>
                                <DatePickerCustom
                                    name="fechaBajaTransitoria"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.fechaBajaTransitoria }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                />
                            </div>


                        </div>
                    </div>
                    )}
                </div>

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('informacionBaja')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.informacionBaja) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.informacionBaja ? 'active' : ''}>Información de baja</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.informacionBaja &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="col-12 col-md-6">
                            <label htmlFor="fechaBaja" className="form-label">Fecha</label>
                                <DatePickerCustom
                                    name="fechaBaja"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.fechaBaja }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="idMotivoBajaRubroComercio" className="form-label">Motivo de baja </label>
                                <InputEntidad
                                    name="idMotivoBajaRubroComercio"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idMotivoBajaRubroComercio }
                                    onChange={ formHandle }
                                    disabled={ props.disabled }
                                    title="Motivo Baja Rubro Comercio"
                                    entidad="MotivoBajaRubroComercio"
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
                        title="Información adicional de Rubros Comercio"
                        processKey={props.processKey}
                        entidad="RubroComercio"
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
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() } >Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

RubroComercioModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
  onChangeChildren: func.isRequired
};

RubroComercioModal.defaultProps = {
  disabled: false
};

export default RubroComercioModal;