import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { DatePickerCustom, InputLista, InputEntidad  } from '../../common';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import { CloneObject } from '../../../utils/helpers';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ServerRequest } from '../../../utils/apiweb';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import ModelosAsociadosGrid from '../ModelosAsociadosGrid';

const ActoProcesalModal = (props) => {

    const entityInit = {
        id: 0,
        idApremio: 0,
        idTipoActoProcesal: 0,
        fechaDesde: null,
        fechaHasta: null,
        observacion: ''
    };
    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        showInfo: false,
        accordions: {
            modelosAsociados: true
        },
    });   
    
    const [modeloAsociados, setModelosAsociados] = useState([]);

    const mount = () => {
        setState(prevState => {
            return {...prevState, entity: props.data.entity}
        });
        formSet({          
            idApremio: props.data.entity.idApremio,
            idTipoActoProcesal: props.data.entity.idTipoActoProcesal,
            fechaDesde: props.data.entity.fechaDesde,
            fechaHasta: props.data.entity.fechaHasta,
            observacion: props.data.entity.observacion,
        });
    }
    useEffect(mount, [props.data]);    

    const [ formValues, formHandle, , formSet ] = useForm({
        idApremio: 0,
        idTipoActoProcesal: 0,
        fechaDesde: null,
        fechaHasta: null,
        observacion: ''
    });

    useEffect(() => {
        if (formValues && formValues.idTipoActoProcesal > 0) {
            SearchModelosAsociados(formValues.idTipoActoProcesal);
        }
    }, [formValues]);

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);

            row.idApremio = parseInt(formValues.idApremio);
            row.idTipoActoProcesal = parseInt(formValues.idTipoActoProcesal);
            row.fechaDesde = formValues.fechaDesde;
            row.fechaHasta = formValues.fechaHasta;
            row.observacion = formValues.observacion;

            props.onConfirm(row);
        };
    };

    //callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState(prevState => {
            return {...prevState, loading: false};
        });
    }
    const callbackSuccessSearchModelosAsociados = (response) => {
        response.json()
        .then((data) => {
            setModelosAsociados(data);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    };

    //funciones
    function SearchModelosAsociados(idTipoActoProcesal) {
        
        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/tipo-acto-procesal/${idTipoActoProcesal}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PLANTILLA_DOCUMENTO,
            paramsUrl,
            null,
            callbackSuccessSearchModelosAsociados,
            callbackNoSuccess,
            callbackError
        );

    }

    function isFormValid() {

        if (formValues.idTipoActoProcesal <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de acto procesal');
            return false;
        }
        if (formValues.fechaDesde == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha desde');
            return false;
        }
        if (formValues.fechaHasta == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha hasta');
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
        <div className="modal-dialog modal-lg">
            <div className="modal-content animated fadeIn">
            <div className="modal-header">
                <h2 className="modal-title">Acto procesal: {(state.entity.id > 0) ? `N° ${state.entity.id}` : "Nuevo"}</h2>
            </div>
            <div className="modal-body">

                <div className="row">
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="idTipoActoProcesal" className="form-label">Tipo de acto procesal</label>
                        <InputEntidad
                            name="idTipoActoProcesal"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoActoProcesal }
                            onChange={ formHandle }

                            disabled={props.disabled}
                            title="Tipo Acto Procesal"
                            entidad="TipoActoProcesal"
                            onFormat= {(row) => (row) ? `${row.codigoActoProcesal} - ${row.descripcion}` : ''}
                            columns={[
                                { Header: 'Codigo', accessor: 'codigoActoProcesal', width: '25%' },
                                { Header: 'Descripción', accessor: 'descripcion', width: '70%' }
                            ]}
                            memo={false}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <label htmlFor="fechaDesde" className="form-label">Fecha desde</label>
                        <DatePickerCustom
                            name="fechaDesde"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaDesde }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <label htmlFor="fechaHasta" className="form-label">Fecha hasta</label>
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
                    <div className="mb-3 col-12">
                        <label htmlFor="observacion" className="form-label">Observaciones</label>
                        <input
                            name="observacion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.observacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                </div>

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('modelosAsociados')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.modelosAsociados) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.modelosAsociados ? 'active' : ''}>Modelos asociados</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.modelosAsociados &&
                    <div className='accordion-body'>
                        <ModelosAsociadosGrid
                            disabled={props.disabled}
                            data={{
                                list: modeloAsociados
                            }}
                        />   
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
                            title="Información adicional de Acto Procesal"
                            processKey={props.processKey}
                            entidad="ActoProcesal"
                            idEntidad={state.entity.id}
                            disabled={props.disabled}
                        />
                    </div>
                    }
                </div>

            </div>
            <div className="modal-footer">
                <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
            </div>
            </div>
        </div>
    </div>

    </>
  );
}


export default ActoProcesalModal;