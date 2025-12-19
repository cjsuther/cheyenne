import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { useEntidad } from '../../hooks/useEntidad';
import { isEmptyString, isValidNumber, OnKeyPress_validInteger } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import InputEntidad from '../../common/InputEntidad';
import InputLista from '../../common/InputLista';
import DatePickerCustom from '../../common/DatePickerCustom';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import InputNumber from '../../common/InputNumber';


const SuperficieModal = (props) => {

  const entityInit = {
    id: 0,
    idInmueble: 0,
    nroSuperficie: "",
    nroInterno: "",
    nroDeclaracionJurada: "",
    idTipoSuperficie: 0,
    metros: 0,
    plano: "",
    idGrupoSuperficie: 0,
    idTipoObraSuperficie: 0,
    idDestinoSuperficie: 0,
    fechaIntimacion: null,
    nroIntimacion: "",
    nroAnterior: "",
    fechaPresentacion: null,
    fechaVigenteDesde: null,
    fechaRegistrado: null,
    fechaPermisoProvisorio: null,
    fechaAprobacion: null,
    conformeObra: false,
    fechaFinObra: null,
    ratificacion: "",
    derechos: ""
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    adicionales: false,
    listSuperficies: [],
    showInfo: false
  });

  const [, getRowEntidad] = useEntidad({
    entidades: ['TipoSuperficie'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoSuperficie',
      timeout: 0
    }
  });

  const mount = () => {
    formSet({
        nroSuperficie: props.data.entity.nroSuperficie,
        nroInterno: props.data.entity.nroInterno,
        nroDeclaracionJurada: props.data.entity.nroDeclaracionJurada,
        idTipoSuperficie: props.data.entity.idTipoSuperficie,
        metros: props.data.entity.metros,
        plano: props.data.entity.plano,
        idGrupoSuperficie: props.data.entity.idGrupoSuperficie,
        idTipoObraSuperficie: props.data.entity.idTipoObraSuperficie,
        idDestinoSuperficie: props.data.entity.idDestinoSuperficie,
        fechaIntimacion: props.data.entity.fechaIntimacion,
        nroIntimacion: props.data.entity.nroIntimacion,
        nroAnterior: props.data.entity.nroAnterior,
        fechaPresentacion: props.data.entity.fechaPresentacion,
        fechaVigenteDesde: props.data.entity.fechaVigenteDesde,
        fechaRegistrado: props.data.entity.fechaRegistrado,
        fechaPermisoProvisorio: props.data.entity.fechaPermisoProvisorio,
        fechaAprobacion: props.data.entity.fechaAprobacion,
        conformeObra: props.data.entity.conformeObra,
        fechaFinObra: props.data.entity.fechaFinObra,
        ratificacion: props.data.entity.ratificacion,
        derechos: props.data.entity.derechos        
    });
    let adicionales = false;
    if (props.data.entity.idTipoSuperficie !== 0) {
        const row = getRowEntidad('TipoSuperficie', props.data.entity.idTipoSuperficie);
        adicionales = (row) ? row.adicionales : false;
    }

    setState(prevState => {
         return {...prevState, entity: props.data.entity, listSuperficies: props.data.listSuperficies, adicionales: adicionales}
    });    
  }
  useEffect(mount, [props.data.entity, props.data.listSuperficies]);

  const [ formValues, formHandle, , formSet ] = useForm({
    nroSuperficie: "",
    nroInterno: "",
    nroDeclaracionJurada: "",
    idTipoSuperficie: 0,
    metros: 0,
    plano: "",
    idGrupoSuperficie: 0,
    idTipoObraSuperficie: 0,
    idDestinoSuperficie: 0,
    fechaIntimacion: null,
    nroIntimacion: "",
    nroAnterior: "",
    fechaPresentacion: null,
    fechaVigenteDesde: null,
    fechaRegistrado: null,
    fechaPermisoProvisorio: null,
    fechaAprobacion: null,
    conformeObra: false,
    fechaFinObra: null,
    ratificacion: "",
    derechos: ""
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.nroSuperficie = formValues.nroSuperficie;
      row.nroInterno = formValues.nroInterno;
      row.nroDeclaracionJurada = formValues.nroDeclaracionJurada;
      row.idTipoSuperficie = parseInt(formValues.idTipoSuperficie);
      row.metros = formValues.metros;
      row.plano = formValues.plano;
      row.idGrupoSuperficie = !isEmptyString(formValues.idGrupoSuperficie) ? parseInt(formValues.idGrupoSuperficie) : 0;
      row.idTipoObraSuperficie = !isEmptyString(formValues.idTipoObraSuperficie) ? parseInt(formValues.idTipoObraSuperficie) : 0;
      row.idDestinoSuperficie = !isEmptyString(formValues.idDestinoSuperficie) ? parseInt(formValues.idDestinoSuperficie) : 0;
      row.fechaIntimacion = formValues.fechaIntimacion;
      row.nroIntimacion = formValues.nroIntimacion;
      row.nroAnterior = formValues.nroAnterior;
      row.fechaPresentacion = formValues.fechaPresentacion;
      row.fechaVigenteDesde = formValues.fechaVigenteDesde;
      row.fechaRegistrado = formValues.fechaRegistrado;
      row.fechaPermisoProvisorio = formValues.fechaPermisoProvisorio;
      row.fechaAprobacion = formValues.fechaAprobacion;
      row.conformeObra = formValues.conformeObra;
      row.fechaFinObra = formValues.fechaFinObra;
      row.ratificacion = formValues.ratificacion;
      row.derechos = formValues.derechos;

      props.onConfirm(row);
    };
  };

  const handleChangeTipoSuperficie = (event) => {
    const {target} = event;
    let idTipoSuperficie = 0;
    let adicionales = false;
    if (target.row) {
        idTipoSuperficie = parseInt(target.value);
        adicionales = target.row.adicionales;
    }
    
    formSet({...formValues,
        idTipoSuperficie: idTipoSuperficie,
        nroInterno: "",
        nroDeclaracionJurada: "",
        idGrupoSuperficie: 0,
        idTipoObraSuperficie: 0,
        idDestinoSuperficie: 0,
        fechaIntimacion: null,
        nroIntimacion: "",
        nroAnterior: "",
        fechaPresentacion: null,
        fechaVigenteDesde: null,
        fechaRegistrado: null,
        fechaPermisoProvisorio: null,
        fechaAprobacion: null,
        conformeObra: false,
        fechaFinObra: null
    });
    setState(prevState => {
        return {...prevState, adicionales: adicionales};
    });

  };

  //funciones
  function isFormValid() {

    if (formValues.nroSuperficie.length === 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número');
        return false;
    }

    if (state.listSuperficies.includes(formValues.nroSuperficie)){
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El Número ingresado ya existe');
        return false;
    }
    
    if (formValues.idTipoSuperficie <= 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo');
        return false;
    }
    if (!isValidNumber(formValues.metros, true)) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Metros cuadrados');
        return false;
    }    

    return true;
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
        <div className="modal-dialog modal-lg">
            <div className="modal-content animated fadeIn">
            <div className="modal-header">
                <h2 className="modal-title">Superficie: {(state.entity.id > 0) ? state.entity.nroSuperficie : "Nuevo"}</h2>
            </div>
            <div className="modal-body">

                <div className="row">
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="nroSuperficie" className="form-label">Número</label>
                        <input
                            name="nroSuperficie"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nroSuperficie}
                            onChange={ formHandle }
                            onKeyPress={ OnKeyPress_validInteger }
                            disabled={props.disabled}
                        />
                    </div>
                    {state.adicionales && 
                    <>
                    <div className="mb-3 col-6 col-md-4">      
                        <label htmlFor="nroInterno" className="form-label">Número interno</label>
                        <input
                            name="nroInterno"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nroInterno }
                            onChange={ formHandle }
                            onKeyPress={ OnKeyPress_validInteger }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="nroDeclaracionJurada" className="form-label">N° Declaración jurada</label>
                        <input
                            name="nroDeclaracionJurada"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nroDeclaracionJurada }
                            onChange={ formHandle }
                            onKeyPress={ OnKeyPress_validInteger }
                            disabled={props.disabled}
                        />
                    </div>
                    </>
                    }
                </div>

                <div className="row">
                    <div className="mb-3 col-12">
                        <label htmlFor="idTipoSuperficie" className="form-label">Tipo</label>
                        <InputEntidad
                            name="idTipoSuperficie"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoSuperficie }
                            onChange={handleChangeTipoSuperficie}
                            disabled={props.disabled}
                            title="Tipo Superficie"
                            entidad="TipoSuperficie"
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="metros" className="form-label">Metros cuadrados</label>
                        <InputNumber
                            name="metros"
                            placeholder=""
                            className="form-control"
                            value={ formValues.metros }
                            precision={2}
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-8">
                        <label htmlFor="plano" className="form-label">Plano</label>
                        <input
                            name="plano"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.plano }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                </div>

                {state.adicionales && 
                <>
                <hr className="solid m-bottom-10"></hr>
                <div className="row">
                    <div className="mb-3 col-12 col-md-4">
                        <label htmlFor="idGrupoSuperficie" className="form-label">Grupo</label>
                        <InputEntidad
                            name="idGrupoSuperficie"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idGrupoSuperficie }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Grupo Superficie"
                            entidad="GrupoSuperficie"
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-4">
                        <label htmlFor="idTipoObraSuperficie" className="form-label">Tipo de obra</label>
                        <InputLista
                            name="idTipoObraSuperficie"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoObraSuperficie }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoObraSuperficie"
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-4">
                        <label htmlFor="idDestinoSuperficie" className="form-label">Destino</label>
                        <InputLista
                            name="idDestinoSuperficie"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idDestinoSuperficie }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="DestinoSuperficie"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaIntimacion" className="form-label">Intimación/Notificación</label>
                        <DatePickerCustom
                            name="fechaIntimacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaIntimacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="nroIntimacion" className="form-label">N°</label>
                        <input
                            name="nroIntimacion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nroIntimacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="nroAnterior" className="form-label">N° Anterior</label>
                        <input
                            name="nroAnterior"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nroAnterior }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaPresentacion" className="form-label">Presentación</label>
                        <DatePickerCustom
                            name="fechaPresentacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaPresentacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaVigenteDesde" className="form-label">Vigente desde</label>
                        <DatePickerCustom
                            name="fechaVigenteDesde"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaVigenteDesde }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaRegistrado" className="form-label">Registrado</label>
                        <DatePickerCustom
                            name="fechaRegistrado"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaRegistrado }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaPermisoProvisorio" className="form-label">Permiso provisorio</label>
                        <DatePickerCustom
                            name="fechaPermisoProvisorio"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaPermisoProvisorio }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaAprobacion" className="form-label">Aprobado</label>
                        <DatePickerCustom
                            name="fechaAprobacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaAprobacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4 p-top-35 form-check">
                        <label htmlFor="conformeObra" className="form-check-label">Conforme a obra</label>
                        <input
                            name="conformeObra"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            onChange={ formHandle }
                            checked={ formValues.conformeObra }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaFinObra" className="form-label">Fin de obra</label>
                        <DatePickerCustom
                            name="fechaFinObra"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaFinObra }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                </div>
                </>
                }
                
                <hr className="solid m-bottom-10"></hr>
                <div className="row">  
                    <div className="mb-3 col-6" >
                        <label htmlFor="ratificacion" className="form-label">Ratificación</label>
                        <input
                            name="ratificacion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.ratificacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6">
                        <label htmlFor="derechos" className="form-label">Derechos</label>
                        <input
                            name="derechos"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.derechos }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
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
                            title="Información adicional de Superficie"
                            processKey={props.processKey}
                            entidad="Superficie"
                            idEntidad={state.entity.id}
                            disabled={props.disabled}
                        />
                    </div>
                    }
                </div>

            </div>
            <div className="modal-footer">
                {!props.disabled &&
                <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
                }
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
            </div>
            </div>
        </div>
    </div>

    </>
  );
}

SuperficieModal.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

SuperficieModal.defaultProps = {
  disabled: false
};

export default SuperficieModal;