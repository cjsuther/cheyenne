import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { APPCONFIG } from '../../app.config';
import { useForm } from '../../components/hooks/useForm';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, AdvancedSearch, InputLista, InputFormat } from '../../components/common';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';
import { MASK_FORMAT } from '../../consts/maskFormat';


function EmisionDefinicionesView() {

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        loading: false,
        dataTagger: {
            showModal: false,
            idEntidad: null
        },
        list: []
    });

    const [message, setMessage] = useState({
        showMessage: false,
        text: "",
        rowId: 0,
        callback: null
    });

    const [filters, setFilters] = useState({
        labels: [
            { title: 'Tipo Tributo', field: 'descTipoTributo', value: '', valueIgnore: ''},
            { title: 'Número Definición', field: 'numero', value: '', valueIgnore: '' },
            { title: 'Descripción', field: 'descripcion', value: '', valueIgnore: '' },
            { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
        ]
    });

    const mount = () => {

        //SearchEmisionDefiniciones();

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, formReset , formSet ] = useForm({
        idTipoTributo: 0,
        descTipoTributo: '', //no existe como control, se usa para tomar el text de idTipoTributo
        numero: '',
        descripcion: '',
        etiqueta: ''
    });

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickEmisionDefinicionAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickEmisionDefinicionView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickEmisionDefinicionModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickEmisionDefinicionClone(props.value) } className="link">
                                        <i className="fa fa-copy" title="clonar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickEmisionDefinicionRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickEmisionDefinicionDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Tipo Tributo', accessor: 'tipoTributo', width: '15%' },
        { Header: 'Numeración', accessor: 'numeracion', width: '15%' },
        { Header: 'Número', accessor: 'numero', width: '10%' },
        { Header: 'Descripción', accessor: 'descripcion', width: '40%' },
        { Header: 'Estado', accessor: 'estadoEmisionDefinicion', width: '10%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickEmisionDefinicionAdd = () => {
        const url = '/emision-definicion/' + OPERATION_MODE.NEW;
        navigate(url, { replace: true });
    }
    const handleClickEmisionDefinicionView = (id) => {
        const url = '/emision-definicion/' + OPERATION_MODE.VIEW + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickEmisionDefinicionModify = (id) => {
        const url = '/emision-definicion/' + OPERATION_MODE.EDIT + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickEmisionDefinicionClone = (id) => {
        setMessage(prevState => {
            return {...prevState, showMessage: true, text: "¿Está seguro de clonar la definición?", rowId: id, callback: CloneEmisionDefinicion};
        });
    }
    const handleClickEmisionDefinicionRemove = (id) => {
        setMessage(prevState => {
            return {...prevState, showMessage: true, text: "¿Está seguro de borrar el registro?", rowId: id, callback: RemoveEmisionDefinicion};
        });
    }
    const handleClickEmisionDefinicionDataTagger = (id) => {
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
    function SearchEmisionDefiniciones() {

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

        const paramsUrl = `/filter?`+
        `idTipoTributo=${formValues.idTipoTributo}&`+
        `numero=${encodeURIComponent(formValues.numero)}&`+
        `descripcion=${encodeURIComponent(formValues.descripcion)}&`+
        `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EMISION_DEFINICION,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveEmisionDefinicion(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchEmisionDefiniciones();
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
            APIS.URLS.EMISION_DEFINICION,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function CloneEmisionDefinicion(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchEmisionDefiniciones();
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const paramsUrl = `/clone/${id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.EMISION_DEFINICION,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    function ApplyFilters() {
        UpdateFilters();
        SearchEmisionDefiniciones();
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
                title="Información adicional de Definición de Emisiones"
                entidad="EmisionDefinicion"
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

        {message.showMessage && 
            <MessageModal
                title={"Confirmación"}
                message={message.text}
                onDismiss={() => {
                    setMessage(prevState => {
                        return {...prevState, showMessage: false, rowId: 0, callback: null};
                    });
                }}
                onConfirm={() => {
                    const id = message.rowId;
                    const callback = message.callback;
                    setMessage(prevState => {
                        return {...prevState, showMessage: false, rowId: 0, callback: null};
                    });
                    callback(id);
                }}
            />
        }

        <SectionHeading title={<>Facturación - Definición de Emisiones</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-7 col-lg-4">
                        <label htmlFor="idTipoTributo" className="form-label">Tipo Tributo</label>
                        <InputLista
                            name="idTipoTributo"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoTributo }
                            onChange={({target}) =>{
                                let idTipoTributo = 0;
                                let descTipoTributo = '';
                                if (target.row) {
                                    idTipoTributo = parseInt(target.value);
                                    descTipoTributo = target.row.nombre;
                                }
                                formSet({...formValues, idTipoTributo: idTipoTributo, descTipoTributo: descTipoTributo});
                            }}
                            lista="TipoTributo"
                        />
                    </div>
                    <div className="col-12 col-md-5 col-lg-2">
                        <label htmlFor="numero" className="form-label">Número Definición</label>
                        <InputFormat
                            name="numero"
                            placeholder=""
                            className="form-control"
                            mask={MASK_FORMAT.EMISION_NUMERO}
                            maskPlaceholder={null}
                            value={formValues.numero}
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-7 col-lg-4">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <input
                            name="descripcion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.descripcion }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-5 col-lg-2">
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
                />

            </div>

        </section>
        
    </>
    )
}

export default EmisionDefinicionesView;
