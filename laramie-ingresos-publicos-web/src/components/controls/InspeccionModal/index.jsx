import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { object, func, bool, string } from 'prop-types';
import { CloneObject, GetMeses } from '../../../utils/helpers';
import { DatePickerCustom, InputNumber, InputEntidad, InputLista, InputExpediente, InputEjercicio } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerFormRedux from '../DataTaggerFormRedux';

const InspeccionModal = (props) => {

    const entityInit = {
        id: 0,
        idComercio: 0,
        numero: '',
        idMotivoInspeccion: 0,
        idSupervisor: 0,
        idInspector: 0,
        fechaInicio: null,
        fechaFinalizacion: null,
        fechaNotificacion: null,
        fechaBaja: null,
        anioDesde: '',
        mesDesde: 0,
        anioHasta: '',
        mesHasta: 0,
        numeroResolucion: '',
        letraResolucion: '',
        anioResolucion: '',
        fechaResolucion: null,
        numeroLegajillo: '',
        letraLegajillo: '',
        anioLegajillo: '',
        activo: '',
        porcentajeMulta: 0,
        emiteConstancia: '',
        pagaPorcentaje: false,
        idExpediente: 0,
    };

    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        showInfo: false,
		accordions: {
			vinculoExpediente: true
		}
    });

    const mount = () => {
        setState(prevState => {
            return {...prevState, entity: props.data.entity };
        });
        formSet({
            numero: props.data.entity.numero,
            idMotivoInspeccion: props.data.entity.idMotivoInspeccion,
            idSupervisor: props.data.entity.idSupervisor,
            idInspector: props.data.entity.idInspector,
            fechaInicio: props.data.entity.fechaInicio,
            fechaFinalizacion: props.data.entity.fechaFinalizacion,
            fechaNotificacion: props.data.entity.fechaNotificacion,
            fechaBaja: props.data.entity.fechaBaja,
            anioDesde: props.data.entity.anioDesde,
            mesDesde: parseInt(props.data.entity.mesDesde),
            anioHasta: props.data.entity.anioHasta,
            mesHasta: parseInt(props.data.entity.mesHasta),
            numeroResolucion: props.data.entity.numeroResolucion,
            letraResolucion: props.data.entity.letraResolucion,
            anioResolucion: props.data.entity.anioResolucion,
            fechaResolucion: props.data.entity.fechaResolucion,
            numeroLegajillo: props.data.entity.numeroLegajillo,
            letraLegajillo: props.data.entity.letraLegajillo,
            anioLegajillo: props.data.entity.anioLegajillo,
            activo: props.data.entity.activo,
            porcentajeMulta: props.data.entity.porcentajeMulta,
            emiteConstancia: props.data.entity.emiteConstancia,
            pagaPorcentaje: props.data.entity.pagaPorcentaje,
            idExpediente: props.data.entity.idExpediente
        });

    }
    useEffect(mount, [props.data.entity]);

    const [ formValues, formHandle, , formSet ] = useForm({
		numero: '',
		idMotivoInspeccion: 0,
		idSupervisor: 0,
		idInspector: 0,
		fechaInicio: null,
		fechaFinalizacion: null,
		fechaNotificacion: null,
		fechaBaja: null,
		anioDesde: '',
		mesDesde: 0,		
		anioHasta: '',
		mesHasta: 0,
		numeroResolucion: '',
		letraResolucion: '',
		anioResolucion: '',
		fechaResolucion: null,
		numeroLegajillo: '',
		letraLegajillo: '',
		anioLegajillo: '',
		activo: '',
		porcentajeMulta: 0,
		emiteConstancia: '',
		pagaPorcentaje: false,
		idExpediente: 0,
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);
            row.numero = formValues.numero;
            row.idMotivoInspeccion = parseInt(formValues.idMotivoInspeccion);
            row.idSupervisor = parseInt(formValues.idSupervisor);
            row.idInspector = parseInt(formValues.idInspector);
            row.fechaInicio = formValues.fechaInicio;
            row.fechaFinalizacion = formValues.fechaFinalizacion;
            row.fechaNotificacion = formValues.fechaNotificacion;
            row.fechaBaja = formValues.fechaBaja;
            row.anioDesde = formValues.anioDesde;
            row.mesDesde = formValues.mesDesde.toString();
            row.anioHasta = formValues.anioHasta;
            row.mesHasta = formValues.mesHasta.toString();
            row.numeroResolucion = formValues.numeroResolucion;
            row.letraResolucion = formValues.letraResolucion;
            row.anioResolucion = formValues.anioResolucion;
            row.fechaResolucion = formValues.fechaResolucion;
            row.numeroLegajillo = formValues.numeroLegajillo;
            row.letraLegajillo = formValues.letraLegajillo;
            row.anioLegajillo = formValues.anioLegajillo;
            row.activo = formValues.activo;
            row.porcentajeMulta = formValues.porcentajeMulta;
            row.emiteConstancia = formValues.emiteConstancia;
            row.pagaPorcentaje = formValues.pagaPorcentaje;
            row.idExpediente = parseInt(formValues.idExpediente);
            
			props.onConfirm(row);
        };
    };

    //funciones
    function isFormValid() {

		if (formValues.numero == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Número de inspección');
			return false;
		}
        if (formValues.idMotivoInspeccion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Motivo de inspección');
            return false;
        }
        if (formValues.idSupervisor <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Supervisor');
            return false;
        }
        if (formValues.idInspector <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Inspector');
            return false;
        }
		if (formValues.anioDesde == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Desde Año');
			return false;
		}
		if (formValues.mesDesde == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Desde Mes');
			return false;
		}
		if (formValues.anioHasta == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Hasta Año');
			return false;
		}
		if (formValues.mesHasta == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Hasta mes');
			return false;
		}
		if (formValues.numeroResolucion == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Resolucion Número');
			return false;
		}
		if (formValues.letraResolucion == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Resolución Letra');
			return false;
		}
		if (formValues.anioResolucion == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Resolución Año');
			return false;
		}
		if (formValues.numeroLegajillo == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Número Legajillo');
			return false;
		}
		if (formValues.letraLegajillo == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Letra Legajillo');
			return false;
		}
		if (formValues.anioLegajillo == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Año Legajillo');
			return false;
		}
		if (formValues.activo == '') {
			ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Activo Legajillo');
			return false;
		}
        if (formValues.porcentajeMulta <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Porcentaje multa');
            return false;
        }
        if (formValues.emiteConstancia == '') {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Emite constancia');
            return false;
        }
        if (formValues.idExpediente <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Vinculo Expediente');
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
		  <div className="modal-dialog modal-dialog-size">
			<div className="modal-content animated fadeIn">
			  <div className="modal-header">
				<h2 className="modal-title">Inspección: {(state.entity.id > 0) ? state.entity.numero : "Nuevo"}</h2>
			  </div>
			  <div className="modal-body">
				<div className="row">
	
					<div className="mb-3 col-12 col-md-6">
						<label htmlFor="numero" className="form-label">Número de inspección</label>
						<input
							name="numero"
							type="text"
							placeholder=""
							className="form-control"
							value={ formValues.numero }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-12 col-md-6">
						<label htmlFor="idMotivoInspeccion" className="form-label">Motivo de inspección</label>
						<InputLista
							name="idMotivoInspeccion"
							placeholder=""
							className="form-control"
							value={ formValues.idMotivoInspeccion }
							onChange={ formHandle }
							disabled={ props.disabled }
							lista="MotivoInspeccion"
						/>
					</div>
	
					<div className="mb-3 col-12 col-md-6">
						<label htmlFor="idSupervisor" className="form-label">Supervisor</label>
						<InputEntidad
							name="idSupervisor"
							placeholder=""
							className="form-control"
							value={ formValues.idSupervisor }
							onChange={ formHandle }
							disabled={ props.disabled }
							title="Supervisor"
							entidad="Controlador"
						/>
					</div>
	
					<div className="mb-3 col-12 col-md-6">
						<label htmlFor="idInspector" className="form-label">Inspector</label>
						<InputEntidad
							name="idInspector"
							placeholder=""
							className="form-control"
							value={ formValues.idInspector }
							onChange={ formHandle }
							disabled={ props.disabled }
							title="Inspector"
							entidad="Controlador"
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="fechaInicio" className="form-label">Fecha inicio</label>
						<DatePickerCustom
							name="fechaInicio"
							placeholder=""
							className="form-control"
							value={ formValues.fechaInicio }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="fechaFinalizacion" className="form-label">Fecha finalización</label>
						<DatePickerCustom
							name="fechaFinalizacion"
							placeholder=""
							className="form-control"
							value={ formValues.fechaFinalizacion }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="fechaNotificacion" className="form-label">Fecha notificación</label>
						<DatePickerCustom
							name="fechaNotificacion"
							placeholder=""
							className="form-control"
							value={ formValues.fechaNotificacion }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="fechaBaja" className="form-label">Fecha baja</label>
						<DatePickerCustom
							name="fechaBaja"
							placeholder=""
							className="form-control"
							value={ formValues.fechaBaja }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6">
						<h3 className="modal-title">Desde:</h3>
					</div>
	
					<div className="mb-3 col-6 ">
						<h3 className="modal-title">Hasta:</h3>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="anioDesde" className="form-label">Año</label>
						<InputEjercicio
							name="anioDesde"
							placeholder=""
							className="form-control"
							value={ formValues.anioDesde }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="mesDesde" className="form-label">Mes</label>
						<select
							name="mesDesde"
							placeholder=""
							className="form-control"
							value={ formValues.mesDesde }
							onChange={ formHandle }
							disabled={ props.disabled }
						>
						{GetMeses(true).map((item, index) =>
							<option value={item.key} key={index}>{item.name}</option>
						)}
						</select>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="anioHasta" className="form-label">Año</label>
						<InputEjercicio
							name="anioHasta"
							placeholder=""
							className="form-control"
							value={ formValues.anioHasta }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="mesHasta" className="form-label">Mes</label>
						<select
							name="mesHasta"
							placeholder=""
							className="form-control"
							value={ formValues.mesHasta }
							onChange={ formHandle }
							disabled={ props.disabled }
						>
						{GetMeses(true).map((item, index) =>
							<option value={item.key} key={index}>{item.name}</option>
						)}
						</select>
					</div>
	
					<div className="mb-3 col-12 ">
						<h3 className="modal-title">Resolución:</h3>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="numeroResolucion" className="form-label">Número</label>
						<input
							name="numeroResolucion"
							type="text"
							placeholder=""
							className="form-control"
							value={ formValues.numeroResolucion }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="letraResolucion" className="form-label">Letra</label>
						<input
							name="letraResolucion"
							type="text"
							placeholder=""
							className="form-control"
							value={ formValues.letraResolucion }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="anioResolucion" className="form-label">Año</label>
						<InputEjercicio
							name="anioResolucion"
							placeholder=""
							className="form-control"
							value={ formValues.anioResolucion }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="fechaResolucion" className="form-label">Fecha</label>
						<DatePickerCustom
							name="fechaResolucion"
							placeholder=""
							className="form-control"
							value={ formValues.fechaResolucion }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
					<div className="mb-3 col-12 ">
						<h3 className="modal-title">Legajillo:</h3>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="numeroLegajillo" className="form-label">Número</label>
						<input
							name="numeroLegajillo"
							type="text"
							placeholder=""
							className="form-control"
							value={ formValues.numeroLegajillo }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="letraLegajillo" className="form-label">Letra</label>
						<input
							name="letraLegajillo"
							type="text"
							placeholder=""
							className="form-control"
							onChange={ formHandle }
                        	value={ formValues.letraLegajillo }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="anioLegajillo" className="form-label">Año</label>
						<InputEjercicio
							name="anioLegajillo"
							placeholder=""
							className="form-control"
							value={ formValues.anioLegajillo }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-xl-3">
						<label htmlFor="activo" className="form-label">Activo</label>
						<select
							name="activo"
							placeholder=""
							className="form-control"
							value={ formValues.activo }
							onChange={ e => {
								const eventCustom = {
									target: {
										name: 'activo',
										type: 'text',
										value: e.target.value
									}
								}
								formHandle(eventCustom);
							}}
							disabled={ props.disabled }
						>
							{["","D"].map((item, index) =>
								<option value={item} key={index}>{item}</option>
							)}
						</select>
					</div>
	
					<div className="mb-3 col-12 col-md-4 col-xl-3">
						<label htmlFor="porcentajeMulta" className="form-label">Porcentaje multa</label>
						<InputNumber
							name="porcentajeMulta"
							placeholder=""
							className="form-control"
							value={ formValues.porcentajeMulta }
							onChange={ formHandle }
							precision={2}
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-6 col-md-4 col-xl-3">
						<label htmlFor="emiteConstancia" className="form-label">Emite constancia</label>
						<select
							name="emiteConstancia"
							placeholder=""
							className="form-control"
							value={ formValues.emiteConstancia }
							onChange={ e => {
								const eventCustom = {
									target: {
										name: 'emiteConstancia',
										type: 'text',
										value: e.target.value
									}
								}
								formHandle(eventCustom);
							}}
							disabled={ props.disabled }
						>
							{["","S","D","C","N","M"].map((item, index) =>
								<option value={item} key={index}>{item}</option>
							)}

						</select>
					</div>
	
					<div className="mb-3 col-6 col-md-4 p-top-35 form-check">
						<label htmlFor="pagaPorcentaje" className="form-check-label">Paga 8%</label>
						<input
							name="pagaPorcentaje"
							type="checkbox"
							className="form-check-input"
							value={''}
							checked={formValues.pagaPorcentaje }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>
	
					<div className="mb-3 col-12">
						<div className='accordion-header'>
							<div className='row'>
								<div className="col-12" onClick={() => ToggleAccordion('vinculoExpediente')}>
									<div className='accordion-header-title'>
										{(state.accordions.vinculoExpediente) ? accordionOpen : accordionClose}
										<h3 className={state.accordions.vinculoExpediente ? 'active' : ''}>Vinculo Expediente</h3>
									</div>
								</div>
							</div>
						</div>
						{(state.accordions.vinculoExpediente &&
						<div className='accordion-body'>
							<div className='row form-basic'>
								<div className="mb-3 col-12">
									<label htmlFor="idExpediente" className="form-label">Vinculo Expediente</label>
									<InputExpediente
										name="idExpediente"
										placeholder=""
										className="form-control"
										value={ formValues.idExpediente }
										onChange={ formHandle }
										disabled={ props.disabled }
									/>
						
								</div>
							</div>
						</div>
						)}
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

InspeccionModal.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

InspeccionModal.defaultProps = {
    disabled: false
};

export default InspeccionModal;
