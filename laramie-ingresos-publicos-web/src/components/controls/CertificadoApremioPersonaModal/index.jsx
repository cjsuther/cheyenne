import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { CloneObject } from '../../../utils/helpers';
import { DatePickerCustom, InputEntidad, InputPersona } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { useLista } from '../../hooks/useLista';
import { useEntidad } from '../../hooks/useEntidad';


const CertificadoApremioPersonaModal = (props) => {

    const entityInit = {
        id: 0,
        idCertificadoApremio: 0,
        idTipoRelacionCertificadoApremioPersona: 0,
        fechaDesde: null,
        fechaHasta: null,
        idPersona: 0,
        idTipoPersona: 0,
        nombrePersona: '',
        idTipoDocumento: 0,
        numeroDocumento: ''
    };
    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        showInfo: false,
    });

    const [persona, setPersona] = useState({
        idTipoPersona: 0,
        nombrePersona: '',
        numeroDocumento: '',
        idTipoDocumento: 0  
    });

    const [tipoControlador, setTipoControlador] = useState(0);

    const [personasControladores, setPersonasControladores] = useState([]);

    const mount = () => {
        setState(prevState => {
            return {...prevState, entity: props.data.entity}
        });
        formSet({          
            idCertificadoApremio: props.data.entity.idCertificadoApremio,
            idTipoRelacionCertificadoApremioPersona: props.data.entity.idTipoRelacionCertificadoApremioPersona,
            fechaDesde: props.data.entity.fechaDesde,
            fechaHasta: props.data.entity.fechaHasta,
            idPersona: props.data.entity.idPersona,
        });
        setPersona({
            idTipoPersona: props.data.entity.idTipoPersona,
            nombrePersona: props.data.entity.nombrePersona,
            numeroDocumento: props.data.entity.numeroDocumento,
            idTipoDocumento: props.data.entity.idTipoDocumento
        });
    }
    useEffect(mount, [props.data.entity]);  

    const [getListEntidad, , readyEntidad] = useEntidad({
        entidades: ['Controlador'],
        onLoaded: (entidades, isSuccess, error) => {
            if (!isSuccess) {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        }
    });

    useEffect(() => {
        if (tipoControlador > 0) {
            const list = getListEntidad('Controlador').filter(f => f.idTipoControlador === tipoControlador).map(x => x.idPersona);
            setPersonasControladores(list);
        }
        else {
            setPersonasControladores([]);
        }
    }, [tipoControlador, readyEntidad])


    const [ formValues, formHandle, , formSet ] = useForm({
        idCertificadoApremio: 0,
        idTipoRelacionCertificadoApremioPersona: 0,
        fechaDesde: null,
        fechaHasta: null,
        idPersona: 0
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);

            row.idCertificadoApremio = parseInt(formValues.idCertificadoApremio);
            row.idTipoRelacionCertificadoApremioPersona = parseInt(formValues.idTipoRelacionCertificadoApremioPersona);
            row.fechaDesde = formValues.fechaDesde;
            row.fechaHasta = formValues.fechaHasta;
            row.idPersona = parseInt(formValues.idPersona);
            row.idTipoPersona = persona.idTipoPersona;
            row.nombrePersona = persona.nombrePersona;
            row.idTipoDocumento = persona.idTipoDocumento;
            row.numeroDocumento = persona.numeroDocumento;                       

            props.onConfirm(row);
        };
    };


    //funciones
    function isFormValid() {

        if (formValues.idTipoRelacionCertificadoApremioPersona <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de relación');
            return false;
        }
        if (formValues.idPersona <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Persona');
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
                    <h2 className="modal-title">Certificado apremio persona: {(state.entity.id > 0) ? `N° ${state.entity.id}` : "Nuevo"}</h2>
                </div>
                <div className="modal-body">

                    <div className="row">
                        <div className="mb-3 col-12 col-md-6">
                            <label htmlFor="idTipoRelacionCertificadoApremioPersona" className="form-label">Tipo de relación</label>
                            <InputEntidad
                                name="idTipoRelacionCertificadoApremioPersona"
                                placeholder=""
                                className="form-control"
                                value={ formValues.idTipoRelacionCertificadoApremioPersona }
                                onChange={({target}) => {
                                    formSet({...formValues,
                                      idTipoRelacionCertificadoApremioPersona: target.value,
                                      idPersona: 0
                                    });
                                }}
                                onUpdate={ (event) => {
                                    if (event.target.row && event.target.row.idTipoControlador){
                                        setTipoControlador(event.target.row.idTipoControlador);
                                    }
                                    else {
                                        setTipoControlador(0);
                                    }
                                }}
                                disabled={props.disabled}
                                title="Tipo Relacion Certificado Apremio Persona"
                                entidad="TipoRelacionCertificadoApremioPersona"
                                onFormat= {(row) => (row) ? `${row.codigo} - ${row.descripcion}` : ''}
                                columns={[
                                    { Header: 'Codigo', accessor: 'codigo', width: '25%' },
                                    { Header: 'Descripcion', accessor: 'descripcion', width: '70%' }
                                ]}
                                memo={false}
                            />
                        </div>
                        <div className="mb-3 col-6 col-md-3">
                            <label htmlFor="fechaDesde" className="form-label">Vigencia desde</label>
                            <DatePickerCustom
                                name="fechaDesde"
                                placeholder=""
                                className="form-control"
                                value={ formValues.fechaDesde }
                                onChange={ formHandle }
                                disabled={props.disabled}
                            />
                        </div>
                        <div className="mb-3 col-6 col-md-3">
                            <label htmlFor="fechaHasta" className="form-label">Vigencia hasta</label>
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
                        {
                            formValues.idTipoRelacionCertificadoApremioPersona > 0 && 
                            <div className="mb-3 col-12">
                                <label htmlFor="idPersona" className="form-label">Persona</label>
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
                                    filter={(row) => {
                                        if (tipoControlador > 0) {
                                            return personasControladores.includes(row.id);
                                        }
                                        else {
                                            return true;
                                        }
                                    }}
                                    disabled={props.disabled}
                                />
                            </div>
                        }
                    </div>


                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary" data-dismiss="modal"  onClick={ (event) => handleClickAceptar() }>Aceptar</button>
                    <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
                </div>
                </div>
            </div>
        </div>

        </>
    );
}


export default CertificadoApremioPersonaModal;