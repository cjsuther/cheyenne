import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject, OpenObjectURL } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import ShowToastMessage from '../../../utils/toast';
import VerificacionesGrid from '../VerificacionesGrid';
import { DatePickerCustom, InputEntidad, InputLista } from '../../common';
import DireccionForm, {GetDataDireccion, IsValidDireccion} from '../DireccionForm';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import { useReporte } from '../../hooks/useReporte';


const InhumadoModal = (props) => {

    const entityInit = {
        id: 0,
        idCementerio: 0,
        idTipoDocumento: 0,
        numeroDocumento: '',
        apellido: '',
        nombre: '',
        fechaNacimiento: null,
        idGenero: 0,
        idEstadoCivil: 0,
        idNacionalidad: 0,
        fechaDefuncion: null,
        fechaIngreso: null,
        idMotivoFallecimiento: 0,
        idCocheria: 0,
        numeroDefuncion: '',
        libro: '',
        folio: '',
        idRegistroCivil: 0,
        acta: '',
        idTipoOrigenInhumacion: 0,
        observacionesOrigen: '',
        idTipoCondicionEspecial: 0,
        fechaEgreso: null,
        fechaTraslado: null,
        idTipoDestinoInhumacion: 0,
        observacionesDestino: '',
        fechaExhumacion: null,
        fechaReduccion: null,
        numeroReduccion: '',
        unidad: '',
        idTipoDocumentoResponsable: 0,
        numeroDocumentoResponsable: '',
        apellidoResponsable: '',
        nombreResponsable: '',
        fechaHoraInicioVelatorio: null,
        fechaHoraFinVelatorio: null,
        direccion: {
          id: 0,
          entidad: "Inhumado",
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
        },
        verificaciones: []
    };

    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        showInfo: false,
        accordions: {
            verificaciones: false,
            velatorio: false
        }
    });

    const mount = () => {
        setState(prevState => {
            return {...prevState, entity: props.data.entity}
        });
        formSet({          
            idTipoDocumento: props.data.entity.idTipoDocumento,
            numeroDocumento: props.data.entity.numeroDocumento,
            apellido: props.data.entity.apellido,
            nombre: props.data.entity.nombre,
            fechaNacimiento: props.data.entity.fechaNacimiento,
            idGenero: props.data.entity.idGenero,
            idEstadoCivil: props.data.entity.idEstadoCivil,
            idNacionalidad: props.data.entity.idNacionalidad,
            fechaDefuncion: props.data.entity.fechaDefuncion,
            fechaIngreso: props.data.entity.fechaIngreso,
            idMotivoFallecimiento: props.data.entity.idMotivoFallecimiento,
            idCocheria: props.data.entity.idCocheria,
            numeroDefuncion: props.data.entity.numeroDefuncion,
            libro: props.data.entity.libro,
            folio: props.data.entity.folio,
            idRegistroCivil: props.data.entity.idRegistroCivil,
            acta: props.data.entity.acta,
            idTipoOrigenInhumacion: props.data.entity.idTipoOrigenInhumacion,
            observacionesOrigen: props.data.entity.observacionesOrigen,
            idTipoCondicionEspecial: props.data.entity.idTipoCondicionEspecial,
            fechaEgreso: props.data.entity.fechaEgreso,
            fechaTraslado: props.data.entity.fechaTraslado,
            idTipoDestinoInhumacion: props.data.entity.idTipoDestinoInhumacion,
            observacionesDestino: props.data.entity.observacionesDestino,
            fechaExhumacion: props.data.entity.fechaExhumacion,
            fechaReduccion: props.data.entity.fechaReduccion,
            numeroReduccion: props.data.entity.numeroReduccion,
            unidad: props.data.entity.unidad,
            idTipoDocumentoResponsable: props.data.entity.idTipoDocumentoResponsable,
            numeroDocumentoResponsable: props.data.entity.numeroDocumentoResponsable,
            apellidoResponsable: props.data.entity.apellidoResponsable,
            nombreResponsable: props.data.entity.nombreResponsable,
            fechaHoraInicioVelatorio: props.data.entity.fechaHoraInicioVelatorio,
            fechaHoraFinVelatorio: props.data.entity.fechaHoraFinVelatorio,
            verificaciones: props.data.entity.verificaciones       
        });
    }
    useEffect(mount, [props.data.entity]);    

    const [ formValues, formHandle, , formSet ] = useForm({
        idTipoDocumento: 0,
        numeroDocumento: '',
        apellido: '',
        nombre: '',
        fechaNacimiento: null,
        idGenero: 0,
        idEstadoCivil: 0,
        idNacionalidad: 0,
        fechaDefuncion: null,
        fechaIngreso: null,
        idMotivoFallecimiento: 0,
        idCocheria: 0,
        numeroDefuncion: '',
        libro: '',
        folio: '',
        idRegistroCivil: 0,
        acta: '',
        idTipoOrigenInhumacion: 0,
        observacionesOrigen: '',
        idTipoCondicionEspecial: 0,
        fechaEgreso: null,
        fechaTraslado: null,
        idTipoDestinoInhumacion: 0,
        observacionesDestino: '',
        fechaExhumacion: null,
        fechaReduccion: null,
        numeroReduccion: '',
        unidad: '',
        idTipoDocumentoResponsable: 0,
        numeroDocumentoResponsable: '',
        apellidoResponsable: '',
        nombreResponsable: '',
        fechaHoraInicioVelatorio: null,
        fechaHoraFinVelatorio: null
    });

    const [ generateReporte, ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer)
                OpenObjectURL(`${reporte}.pdf`, buffer);
            else
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);
            
            row.idTipoDocumento = parseInt(formValues.idTipoDocumento);
            row.numeroDocumento = formValues.numeroDocumento;
            row.apellido = formValues.apellido;
            row.nombre = formValues.nombre;
            row.fechaNacimiento = formValues.fechaNacimiento;
            row.idGenero = parseInt(formValues.idGenero);
            row.idEstadoCivil = parseInt(formValues.idEstadoCivil);
            row.idNacionalidad = parseInt(formValues.idNacionalidad);
            row.fechaDefuncion = formValues.fechaDefuncion;
            row.fechaIngreso = formValues.fechaIngreso;
            row.idMotivoFallecimiento = parseInt(formValues.idMotivoFallecimiento);
            row.idCocheria = parseInt(formValues.idCocheria);
            row.numeroDefuncion = formValues.numeroDefuncion;
            row.libro = formValues.libro;
            row.folio = formValues.folio;
            row.idRegistroCivil = parseInt(formValues.idRegistroCivil);
            row.acta = formValues.acta;
            row.idTipoOrigenInhumacion = parseInt(formValues.idTipoOrigenInhumacion);
            row.observacionesOrigen = formValues.observacionesOrigen;
            row.idTipoCondicionEspecial = parseInt(formValues.idTipoCondicionEspecial);
            row.fechaEgreso = formValues.fechaEgreso;
            row.fechaTraslado = formValues.fechaTraslado;
            row.idTipoDestinoInhumacion = parseInt(formValues.idTipoDestinoInhumacion);
            row.observacionesDestino = formValues.observacionesDestino;
            row.fechaExhumacion = formValues.fechaExhumacion;
            row.fechaReduccion = formValues.fechaReduccion;
            row.numeroReduccion = formValues.numeroReduccion;
            row.unidad = formValues.unidad;
            row.idTipoDocumentoResponsable = parseInt(formValues.idTipoDocumentoResponsable);
            row.numeroDocumentoResponsable = formValues.numeroDocumentoResponsable;
            row.apellidoResponsable = formValues.apellidoResponsable;
            row.nombreResponsable = formValues.nombreResponsable;
            row.fechaHoraInicioVelatorio = formValues.fechaHoraInicioVelatorio;
            row.fechaHoraFinVelatorio = formValues.fechaHoraFinVelatorio;

            row.direccion = GetDataDireccion.get("Inhumado_direccion")();

            props.onConfirm(row);
        };
    };

    const handleClickReporte = (reporte) => {
        const paramsReporte = {
            idCementerio: state.entity.idCementerio,
            idInhumado: state.entity.id
        }
        generateReporte(reporte, paramsReporte);
    }

    //funciones
    function isFormValid() {

        if (formValues.idTipoDocumento <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de documento');
            return false;
        }
        if (formValues.numeroDocumento.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número de documento');
            return false;
        }
        if (formValues.apellido.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Apellido');
            return false;
        }
        if (formValues.nombre.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Nombre');
            return false;
        }  
        if (formValues.idGenero <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Género');
            return false;
        }   
        if (formValues.idEstadoCivil <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Estado civil');
            return false;
        }   
        if (formValues.idNacionalidad <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Nacionalidad');
            return false;
        }  
        if (formValues.idMotivoFallecimiento <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Motivo de fallecimiento');
            return false;
        }  
        if (formValues.idCocheria <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Cochería');
            return false;
        }  
        if (formValues.numeroDefuncion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número de defunción');
            return false;
        }  
        if (formValues.libro.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Libro');
            return false;
        }  
        if (formValues.folio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Folio');
            return false;
        }  
        if (formValues.idRegistroCivil <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Registro civil');
            return false;
        }      
        if (formValues.acta.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Acta');
            return false;
        }    
        if (formValues.idTipoOrigenInhumacion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo origen');
            return false;
        }     
        if (formValues.observacionesOrigen.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Observaciones origen');
            return false;
        }  
        if (formValues.idTipoCondicionEspecial <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo condición especial');
            return false;
        }    
        if (formValues.idTipoDestinoInhumacion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo destino');
            return false;
        }    
        if (formValues.observacionesDestino.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Observaciones destino');
            return false;
        }  
        if (formValues.numeroReduccion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número de reducción');
            return false;
        }  
        if (formValues.unidad.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Unidad');
            return false;
        }  
        if (formValues.idTipoDocumentoResponsable <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo documento del responsable');
            return false;
        }    
        if (formValues.numeroDocumentoResponsable.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número de documento del responsable');
            return false;
        }  
        if (formValues.apellidoResponsable.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Apellido del responsable');
            return false;
        }  
        if (formValues.nombreResponsable.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Nombre del responsable');
            return false;
        }
        
        const isValidDireccion = IsValidDireccion.get("Inhumado_direccion")();
        if (!isValidDireccion.result) {
          ShowToastMessage(ALERT_TYPE.ALERT_WARNING, isValidDireccion.message);
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
                <h2 className="modal-title">Inhumado: {(state.entity.id > 0) ? `Defunción N° ${formValues.numeroDefuncion}` : "Nuevo"}</h2>
            </div>
            <div className="modal-body">
                <div className="row">

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idTipoDocumento" className="form-label">Tipo de documento</label>
                        <InputLista
                            name="idTipoDocumento"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoDocumento }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoDocumento"
                        />
                    </div>
                    
                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="numeroDocumento" className="form-label">Número de documento</label>
                        <input
                            name="numeroDocumento"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numeroDocumento }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="apellido" className="form-label">Apellido</label>
                        <input
                            name="apellido"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.apellido }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            name="nombre"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nombre }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>   
                    
                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>
                        <DatePickerCustom
                            name="fechaNacimiento"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaNacimiento }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idGenero" className="form-label">Género</label>
                        <InputLista
                            name="idGenero"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idGenero }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="Genero"
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idEstadoCivil" className="form-label">Estado civil</label>
                        <InputLista
                            name="idEstadoCivil"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idEstadoCivil }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="EstadoCivil"
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idNacionalidad" className="form-label">Nacionalidad</label>
                        <InputEntidad
                            name="idNacionalidad"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idNacionalidad }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Nacionalidad"
                            entidad="Pais"
                        />
                    </div>

                </div>
                <hr className="solid m-bottom-10"></hr>
                <div className='row'>
                    
                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="fechaDefuncion" className="form-label">Fecha de defunción</label>
                        <DatePickerCustom
                            name="fechaDefuncion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaDefuncion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />                        
                    </div>
                    
                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="fechaIngreso" className="form-label">Fecha de ingreso</label>
                        <DatePickerCustom
                            name="fechaIngreso"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaIngreso }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idMotivoFallecimiento" className="form-label">Motivo de fallecimiento</label>
                        <InputLista
                            name="idMotivoFallecimiento"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idMotivoFallecimiento }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="MotivoFallecimiento"
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idCocheria" className="form-label">Cochería</label>
                        <InputEntidad
                            name="idCocheria"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idCocheria }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Cocheria"
                            entidad="Cocheria"
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="numeroDefuncion" className="form-label">Defunción N°</label>
                        <input
                            name="numeroDefuncion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numeroDefuncion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="libro" className="form-label">Libro</label>
                        <input
                            name="libro"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.libro }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="folio" className="form-label">Folio</label>
                        <input
                            name="folio"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.folio }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idRegistroCivil" className="form-label">Registro civil</label>
                        <InputEntidad
                            name="idRegistroCivil"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idRegistroCivil }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Registro Civil"
                            entidad="RegistroCivil"
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="acta" className="form-label">Acta</label>
                        <input
                            name="acta"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.acta }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                </div>
                <hr className="solid m-bottom-10"></hr>
                <div className='row'>
                    
                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idTipoOrigenInhumacion" className="form-label">Tipo origen</label>
                        <InputLista
                            name="idTipoOrigenInhumacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoOrigenInhumacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoOrigenInhumacion"
                        />
                    </div>

                    <div className="mb-3 col-6">
                        <label htmlFor="idTipoCondicionEspecial" className="form-label">Tipo Condición especial</label>
                        <InputEntidad
                            name="idTipoCondicionEspecial"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoCondicionEspecial }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Tipo Condicion Especial"
                            entidad="TipoCondicionEspecial"
                        />                    
                    </div>

                    <div className="mb-3 col-12">
                        <label htmlFor="observacionesOrigen" className="form-label">Observaciones origen</label>
                        <input
                            name="observacionesOrigen"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.observacionesOrigen }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                </div>
                <div className='row'>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idTipoDestinoInhumacion" className="form-label">Tipo destino</label>
                        <InputLista
                            name="idTipoDestinoInhumacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoDestinoInhumacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoDestinoInhumacion"
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="fechaEgreso" className="form-label">Fecha de egreso</label>
                        <DatePickerCustom
                            name="fechaEgreso"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaEgreso }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="fechaTraslado" className="form-label">Fecha traslado</label>
                        <DatePickerCustom
                            name="fechaTraslado"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaTraslado }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-12">
                        <label htmlFor="observacionesDestino" className="form-label">Observaciones destino</label>
                        <input
                            name="observacionesDestino"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.observacionesDestino }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                </div>
                <hr className="solid m-bottom-10"></hr>
                <div className='row'>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="fechaExhumacion" className="form-label">Fecha de exhumación</label>
                        <DatePickerCustom
                            name="fechaExhumacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaExhumacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="fechaReduccion" className="form-label">Fecha de reducción</label>
                        <DatePickerCustom
                            name="fechaReduccion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaReduccion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="numeroReduccion" className="form-label">Número de reducción</label>
                        <input
                            name="numeroReduccion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numeroReduccion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="unidad" className="form-label">Unidad</label>
                        <input
                            name="unidad"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.unidad }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                </div>
                <hr className="solid m-bottom-10"></hr>
                <div className='row'>

                    <div className="mb-3">
                        <h2 className="modal-title">Responsable:</h2>
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="idTipoDocumentoResponsable" className="form-label">Tipo de documento</label>
                        <InputLista
                            name="idTipoDocumentoResponsable"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoDocumentoResponsable }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoDocumento"
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="numeroDocumentoResponsable" className="form-label">Número de documento</label>
                        <input
                            name="numeroDocumentoResponsable"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numeroDocumentoResponsable }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="apellidoResponsable" className="form-label">Apellido</label>
                        <input
                            name="apellidoResponsable"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.apellidoResponsable }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-xl-3">
                        <label htmlFor="nombreResponsable" className="form-label">Nombre</label>
                        <input
                            name="nombreResponsable"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nombreResponsable }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    
                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('velatorio')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.velatorio) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.velatorio ? 'active' : ''}>Velatorio</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.velatorio &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="mb-3 col-6 col-xl-3">
                                    <label htmlFor="fechaHoraInicioVelatorio" className="form-label">Fecha y hora de inicio</label>
                                    <DatePickerCustom
                                        name="fechaHoraInicioVelatorio"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.fechaHoraInicioVelatorio }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                        time={true}
                                    />
                                </div>
                                <div className="mb-3 col-6 col-xl-3">
                                    <label htmlFor="fechaHoraFinVelatorio" className="form-label">Fecha y hora de fin</label>
                                    <DatePickerCustom
                                        name="fechaHoraFinVelatorio"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.fechaHoraFinVelatorio }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                        time={true}
                                    />
                                </div>
                                <div className="mb-3 col-12">
                                    <DireccionForm
                                        id="Inhumado_direccion"
                                        data={{
                                            entity: state.entity.direccion
                                        }}
                                        disabled={props.disabled}
                                        initFormEdit={(state.entity.direccion.id === 0 && state.entity.direccion.latitud === 0 && state.entity.direccion.longitud === 0)}
                                    />
                                </div>
                            </div>
                        </div>
                        )}
                    </div>

                    {(props.showChildren &&
                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('verificaciones')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.verificaciones) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.verificaciones ? 'active' : ''}>Verificaciones</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.verificaciones &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <VerificacionesGrid
                                    processKey={props.processKey}
                                    disabled={props.disabled}
                                    data={{
                                        idInhumado: state.entity.id,
                                        list: state.entity.verificaciones
                                    }}
                                    onChange={props.onChangeChildren}                                    
                                />
                            </div>
                        </div>
                        )}
                    </div>
                    )}

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
                                title="Información adicional de Inhumado"
                                processKey={props.processKey}
                                entidad="Inhumado"
                                idEntidad={state.entity.id}
                                disabled={props.disabled}
                            />
                        </div>
                        }
                    </div>


                </div>
            </div>

            <div className="modal-footer modal-footer-unset">
                {state.entity.id > 0 &&
                <>
                <button className="btn back-button float-start" data-dismiss="modal" onClick={ (event) => handleClickReporte("CementerioSolicitudReduccion") }>Solicitud de Reducción</button>
                <button className="btn back-button float-start" data-dismiss="modal" onClick={ (event) => handleClickReporte("CementerioSolicitudInhumacion") }>Solicitud de Inhumación</button>
                <button className="btn back-button float-start" data-dismiss="modal" onClick={ (event) => handleClickReporte("CementerioSolicitudVerificacion") }>Solicitud de Verificación</button>
                </>
                }
                {!props.disabled &&
                <button className="btn btn-primary float-end" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
                }
                <button className="btn btn-outline-primary float-end" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
            </div>

            </div>
        </div>
        </div>

        </>
  );
}

InhumadoModal.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
    onChangeChildren: func.isRequired
};
  
InhumadoModal.defaultProps = {
    disabled: false
};

export default InhumadoModal;
