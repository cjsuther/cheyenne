import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { object, func, bool, string } from 'prop-types';
import { CloneObject, GetMeses } from '../../../utils/helpers';
import { DatePickerCustom, InputNumber, InputEntidad, InputLista, InputExpediente, InputEjercicio } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerFormRedux from '../DataTaggerFormRedux';


const ElementoModal = (props) => {

    const entityInit = {
        id: 0,
        idCuenta: 0,
        idClaseElemento: 0,
        idTipoElemento: 0,
        cantidad: 0,
		fechaAlta: null,
		fechaBaja: null
    };

    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        showInfo: false
    });

	const [tipoElementoState, setTipoElementoState] = useState({
		nombre: '',
		valor: 0,
		idUnidadMedida: 0
  	});

    const mount = () => {
        setState(prevState => {
            return {...prevState, entity: props.data.entity };
        });

        formSet({
            idTipoElemento: props.data.entity.idTipoElemento,
            cantidad: props.data.entity.cantidad,
            fechaAlta: props.data.entity.fechaAlta == null ? new Date() : props.data.entity.fechaAlta,
            fechaBaja: props.data.entity.fechaBaja
        });

    }
    useEffect(mount, [props.data.entity]);

    const [ formValues, formHandle, , formSet ] = useForm({
        idTipoElemento: 0,
        cantidad: 0,
		fechaAlta: null,
		fechaBaja: null
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);
            row.idTipoElemento = parseInt(formValues.idTipoElemento);
            row.cantidad = parseInt(formValues.cantidad);
            row.fechaAlta = formValues.fechaAlta;
            row.fechaBaja = formValues.fechaBaja;

			props.onConfirm(row);
        };
    };

    //funciones
    function isFormValid() {
		if (formValues.idTipoElemento <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Elemento');
            return false;
        }

		if (formValues.cantidad <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Cantidad');
            return false;
        }

		if (formValues.fechaAlta == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha Alta');
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
		  <div className="modal-dialog modal-dialog-size">
			<div className="modal-content animated fadeIn">
			  <div className="modal-header">
				<h2 className="modal-title">Elemento: {(state.entity.id > 0) ? tipoElementoState.nombre : "Nuevo"}</h2>
			  </div>
			  <div className="modal-body">
				<div className="row">

					<div className="mb-3 col-12 col-md-12">
						<label htmlFor="idClaseElemento" className="form-label">Clase Elemento</label>
						<InputEntidad
							name="idClaseElemento"
							placeholder=""
							className="form-control"
							value={ props.data.entity.idClaseElemento }
							disabled={ true }
							title="ClaseElemento"
							entidad="ClaseElemento"
						/>
					</div>

					<div className="mb-3 col-12 col-md-12">
						<label htmlFor="idTipoElemento" className="form-label">Tipo Elemento</label>
						<InputEntidad
							name="idTipoElemento"
							placeholder=""
							className="form-control"
							value={ formValues.idTipoElemento }
							onChange={ formHandle }
							onUpdate={ (event) => {
								if (event.target.row){
									setTipoElementoState( prevState => {
										return {
											...prevState,
											nombre: event.target.row.nombre,
											valor: event.target.row.valor,
											idUnidadMedida: event.target.row.idUnidadMedida,
										}
									})
								}
							}}
							disabled={ props.disabled }
							filter={(row) => row.idClaseElemento === props.data.entity.idClaseElemento}
							title="TipoElemento"
							entidad="TipoElemento"
						/>
					</div>

					<div className="mb-3 col-12 col-sm-6">
						<label htmlFor="valor" className="form-label">Valor</label>
						<input
							name="valor"
							type="number"
							placeholder=""
							className="form-control"
							value={ tipoElementoState.valor }        
							disabled={true}
						/>
					</div>

					<div className="mb-3 col-12 col-sm-6">
						<label htmlFor="idUnidadMedida" className="form-label">Unidad medida</label>
						<InputLista
							name="idUnidadMedida"
							placeholder=""
							className="form-control"
							value={ tipoElementoState.idUnidadMedida }
							disabled={ true }
							title="UnidadMedida"
							lista="UnidadMedida"
						/>
					</div>
		
					<div className="mb-3 col-12 col-md-4">
						<label htmlFor="cantidad" className="form-label">Cantidad</label>
						<InputNumber
							name="cantidad"
							placeholder=""
							className="form-control"
							value={ formValues.cantidad }
							onChange={ formHandle }
							precision={0}
							disabled={ props.disabled }
						/>
					</div>

					<div className="mb-3 col-6 col-md-4">
						<label htmlFor="fechaAlta" className="form-label">Fecha alta</label>
						<DatePickerCustom
							name="fechaAlta"
							placeholder=""
							className="form-control"
							value={ formValues.fechaAlta }
							onChange={ formHandle }
							disabled={ props.disabled }
						/>
					</div>

					<div className="mb-3 col-6 col-md-4">
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

ElementoModal.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

ElementoModal.defaultProps = {
    disabled: false
};

export default ElementoModal;
