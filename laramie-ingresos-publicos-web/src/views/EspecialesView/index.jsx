import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { CUENTA_STATE } from '../../consts/cuentaState';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { APPCONFIG } from '../../app.config';
import { useForm } from '../../components/hooks/useForm';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, InputPersona, AdvancedSearch, InputFormat } from '../../components/common';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';
import { MASK_FORMAT } from '../../consts/maskFormat';


function EspecialesView() {

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        loading: false,
        showMessage: false,
        rowId: 0,
        dataTagger: {
            showModal: false,
            idEntidad: null
        },
        list: []
    });

    const [filters, setFilters] = useState({
        labels: [
            { title: 'Persona', field: 'descPersona', value: '', valueIgnore: ''},
            { title: 'Nro. Cuenta', field: 'numeroCuenta', value: '', valueIgnore: '' },
            { title: 'Nro. Web', field: 'numeroWeb', value: '', valueIgnore: '' },
            { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
        ]
    });

    const mount = () => {

        //SearchEspeciales();

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, formReset , formSet ] = useForm({
        idPersona: 0,
        descPersona: '', //no existe como control, se usa para tomar el text de idPersona
        numeroCuenta: '',
        numeroWeb: '',
        etiqueta: ''
    });
    const hasActiveFilters = useMemo(() => {
        return Object.values(formValues).some(value => value !== '' && value !== 0)
    }, [formValues])

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickEspecialAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickEspecialView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {props.row.original.idEstadoCuenta !== CUENTA_STATE.INACTIVA &&
                                    <>
                                    <div onClick={ (event) => handleClickEspecialModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickEspecialRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    </>
                                    }
                                    <div onClick={ (event) => handleClickEspecialDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Nro. Cuenta', accessor: 'numeroCuenta', width: '20%' },
        { Header: 'Clave Web', accessor: 'numeroWeb', width: '20%' },
        { Header: 'Detalle', accessor: 'id', width: '50%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickEspecialAdd = () => {
        const url = '/cuenta-especial/' + OPERATION_MODE.NEW;
        navigate(url, { replace: true });
    }
    const handleClickEspecialView = (id) => {
        const url = '/cuenta-especial/' + OPERATION_MODE.VIEW + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickEspecialModify = (id) => {
        const url = '/cuenta-especial/' + OPERATION_MODE.EDIT + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickEspecialRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: id};
        });
    }
    const handleClickEspecialDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
    }

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

    //funciones
    function SearchEspeciales() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setState(prevState => {
                    return {...prevState, loading: false, list: data};
                });
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        let paramsUrl = `/cuenta/filter?`+
            `numeroCuenta=${encodeURIComponent(formValues.numeroCuenta)}&`+
            `numeroWeb=${encodeURIComponent(formValues.numeroWeb)}&`+
            `numeroDocumento=&`+ //no lo usamos en esta pantalla, es preferible que acceda por persona
            `idPersona=${formValues.idPersona}&`+
            `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.ESPECIAL,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveEspecial(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchEspeciales();
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const paramsUrl = `/${id}`;

        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.ESPECIAL,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    function ApplyFilters() {
        UpdateFilters();
        SearchEspeciales();
    }
    function UpdateFilters() {
        let labels = [...filters.labels];
        labels.forEach((label) => {
            label.value = formValues[label.field];
        });
        setFilters(prevState => {
            return {...prevState, labels: labels};
        });
    }


    return (
    <>

        <Loading visible={state.loading}></Loading>

        {state.dataTagger.showModal &&
            <DataTaggerModalApi
                title="Información adicional de Cuenta Especial"
                entidad="Especial"
                idEntidad={state.dataTagger.idEntidad}
                disabled={false}
                onConfirm={() => {
                    setState(prevState => {
                        return {...prevState, dataTagger: {showModal: false, idEntidad: null}};
                    });
                }}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, dataTagger: {showModal: false, idEntidad: null}};
                    });
                }}
            />
        }

        {state.showMessage && 
            <MessageModal
                title={"Confirmación"}
                message={"¿Está seguro de borrar el registro?"}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showMessage: false, rowId: 0};
                    });
                }}
                onConfirm={() => {
                    const id = state.rowId;
                    setState(prevState => {
                        return {...prevState, showMessage: false, rowId: 0};
                    });
                    RemoveEspecial(id);
                }}
            />
        }

        <SectionHeading title={<>Administración de Cuentas Especiales</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
                requireFilter
                hasActiveFilters={hasActiveFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-2">
                        <label htmlFor="numeroCuenta" className="form-label">Número Cuenta</label>
                        <InputFormat
                            name="numeroCuenta"
                            placeholder=""
                            className="form-control"
                            mask={MASK_FORMAT.CUENTA}
                            maskPlaceholder={null}
                            value={ formValues.numeroCuenta }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                        <label htmlFor="numeroWeb" className="form-label">Clave Web</label>
                        <InputFormat
                            name="numeroWeb"
                            placeholder=""
                            className="form-control"
                            mask={MASK_FORMAT.CLAVE_WEB}
                            maskPlaceholder={null}
                            value={ formValues.numeroWeb }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-5">
                        <label htmlFor="idPersona" className="form-label">Persona</label>
                        <InputPersona
                            name="idPersona"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idPersona }
                            idTipoPersona={0}
                            onChange={({target}) =>{
                                let idPersona = 0;
                                let descPersona = '';
                                if (target.row) {
                                    idPersona = parseInt(target.value);
                                    descPersona = target.row.nombrePersona;
                                }
                                formSet({...formValues, idPersona: idPersona, descPersona: descPersona});
                            }}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="etiqueta" className="form-label">Etiqueta</label>
                        <input
                            name="etiqueta"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.etiqueta }
                            onChange={ formHandle }
                        />
                    </div>
                </div>

            </AdvancedSearch>

            <div className="m-top-20">

                <TableCustom
                    className={'TableCustomBase'}
                    columns={tableColumns}
                    data={state.list}
                    limitDataSize
                />

            </div>

        </section>
        
    </>
    )
}

export default EspecialesView;
