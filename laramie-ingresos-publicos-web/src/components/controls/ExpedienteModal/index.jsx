import React, { useState, useEffect } from 'react';
import { func, bool } from 'prop-types';
import { useForm } from '../../hooks/useForm';

import { Loading, InputEntidad, InputLista, DatePickerCustom, InputEjercicio } from '../../common';

const ExpedienteModal = (props) => {

    //variables
    const entityInit = {
        id: 0,
        matricula: '',
        ejercicio: '',
        numero: '',
        letra: '',
        idProvincia: 0,
        idTipoExpediente: 0,
        subnumero: '',
        idTemaExpediente: 0,
        referenciaExpediente: '',
        fechaCreacion: null
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit,
        showInfo: false
    });
    
    const mount = () => {
        setState(prevState => {
            return {...prevState, entity: props.data.entity };
        });
        formSet({
            matricula: props.data.entity.matricula,
            ejercicio: props.data.entity.ejercicio,
            numero: props.data.entity.numero,
            letra: props.data.entity.letra,
            idProvincia: props.data.entity.idProvincia,
            idTipoExpediente: props.data.entity.idTipoExpediente,
            subnumero: props.data.entity.subnumero,
            idTemaExpediente: props.data.entity.idTemaExpediente,
            referenciaExpediente: props.data.entity.referenciaExpediente,
            fechaCreacion: new Date(props.data.entity.fechaCreacion)
        });
    }
    useEffect(mount, [props.data.entity]);

    const [ formValues, formHandle, , formSet ] = useForm({
        matricula: '',
        ejercicio: '',
        numero: '',
        letra: '',
        idProvincia: 0,
        idTipoExpediente: 0,
        subnumero: '',
        idTemaExpediente: 0,
        referenciaExpediente: '',
        fechaCreacion: null
    });

    return (
        <>

        <Loading visible={state.loading}></Loading>
    
        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-lg">
            <div className="modal-content animated fadeIn">
              <div className="modal-header">
              <h2 className="modal-title">Expediente: {state.entity.ejercicio}-{state.entity.numero}-{state.entity.letra}</h2>
              </div>
              <div className="modal-body">
                <div className="row">

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="ejercicio" className="form-label">Ejercicio</label>
                        <InputEjercicio
                            name="ejercicio"
                            placeholder=""
                            className="form-control"
                            value={ formValues.ejercicio }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="numero" className="form-label">Número</label>
                        <input
                            name="numero"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numero }
                            onChange={ formHandle }
                            disabled={props.disabled} 
                            maxLength="50" 
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="letra" className="form-label">Letra</label>
                        <input
                            name="letra"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.letra }
                            onChange={ formHandle }
                            disabled={props.disabled}  
                            maxLength="50"
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="matricula" className="form-label">Matricula</label>
                        <input
                            name="matricula"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.matricula }
                            onChange={ formHandle }
                            disabled={props.disabled}  
                            maxLength="50"                          
                        />
                    </div>

                    <div className="mb-3 col-12 col-lg-4">
                        <label htmlFor="idProvincia" className="form-label">Provincia</label>
                        <InputEntidad
                            name="idProvincia"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idProvincia }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Provincia"
                            entidad="Provincia"
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="subnumero" className="form-label">Sub número</label>
                        <input
                            name="subnumero"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.subnumero }
                            onChange={ formHandle }
                            disabled={props.disabled}  
                            maxLength="50"
                        />
                    </div>

                    <div className="mb-3 col-6 col-lg-4">
                        <label htmlFor="fechaCreacion" className="form-label">Fecha creación</label>
                        <DatePickerCustom
                            name="fechaCreacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaCreacion }
                            onChange={ formHandle }
                            disabled={props.disabled}  
                        />
                    </div>

                    <div className="mb-3 col-12 col-lg-8">
                        <label htmlFor="idTipoExpediente" className="form-label">Tipo de expediente</label>
                        <InputLista
                            name="idTipoExpediente"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoExpediente }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoExpediente"
                        />
                    </div>
                    
                    <div className="mb-3 col-12">
                        <label htmlFor="idTemaExpediente" className="form-label">Tema de expediente</label>
                        <InputEntidad
                            name="idTemaExpediente"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTemaExpediente }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Tema de expediente"
                            entidad="TemaExpediente"
                        />
                    </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
              </div>

            </div>
          </div>
        </div>
    
        </>
      );
    }
    

ExpedienteModal.propTypes = {
    disabled: bool,
    onDismiss: func.isRequired
};

ExpedienteModal.defaultProps = {
    disabled: false
};    

export default ExpedienteModal;
