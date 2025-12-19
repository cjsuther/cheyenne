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
import { Loading, TableCustom, MessageModal, SectionHeading, AdvancedSearch, InputLista, InputFormat, InputEntidad } from '../../components/common';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';
import { MASK_FORMAT } from '../../consts/maskFormat';


function EmisionEjecucionesView() {

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
            { title: 'Tipo Tributo', field: 'descTipoTributo', value: '', valueIgnore: ''},
            { title: 'Número Definición', field: 'descEmisionDefinicion', value: '', valueIgnore: ''},
            { title: 'Número Ejecución', field: 'numero', value: '', valueIgnore: '' },
            { title: 'Descripción', field: 'descripcion', value: '', valueIgnore: '' },
            { title: 'Período', field: 'periodo', value: '', valueIgnore: '' },
            { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
        ]
    });

    const mount = () => {

        //SearchEmisionEjecuciones();

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, formReset , formSet ] = useForm({
        idTipoTributo: 0,
        descTipoTributo: '', //no existe como control, se usa para tomar el text de idTipoTributo
        idEmisionDefinicion: 0,
        descEmisionDefinicion: '', //no existe como control, se usa para tomar el text de idEmisionDefinicion
        numero: '',
        descripcion: '',
        periodo: '',
        etiqueta: ''
    });

    //ejecuciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickEmisionEjecucionAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickEmisionEjecucionView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickEmisionEjecucionModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickEmisionEjecucionRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickEmisionEjecucionDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Tipo Tributo', accessor: 'tipoTributo', width: '10%' },
        { Header: 'Numeración', accessor: 'numeracion', width: '14%' },
        { Header: 'Nro. Definición', accessor: 'numeroEmisionDefinicion', width: '12%' },
        { Header: 'Nro. Ejecución', accessor: 'numeroEmisionEjecucion', width: '12%' },
        { Header: 'Descripción', accessor: 'descripcionEmisionEjecucion', width: '26%' },
        { Header: 'Período', accessor: 'periodo', width: '8%' },
        { Header: 'Estado', accessor: 'estadoEmisionEjecucion', width: '8%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickEmisionEjecucionAdd = () => {
        const url = '/emision-ejecucion/' + OPERATION_MODE.NEW;
        navigate(url, { replace: true });
    }
    const handleClickEmisionEjecucionView = (id) => {
        const url = '/emision-ejecucion/' + OPERATION_MODE.VIEW + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickEmisionEjecucionModify = (id) => {
        const url = '/emision-ejecucion/' + OPERATION_MODE.EDIT + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickEmisionEjecucionRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: id};
        });
    }
    const handleClickEmisionEjecucionDataTagger = (id) => {
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
    function SearchEmisionEjecuciones() {

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
        `idEmisionDefinicion=${formValues.idEmisionDefinicion}&`+
        `numero=${encodeURIComponent(formValues.numero)}&`+
        `descripcion=${encodeURIComponent(formValues.descripcion)}&`+
        `periodo=${encodeURIComponent(formValues.periodo)}&`+
        `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EMISION_EJECUCION,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveEmisionEjecucion(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchEmisionEjecuciones();
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
            APIS.URLS.EMISION_EJECUCION,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    function ApplyFilters() {
        UpdateFilters();
        SearchEmisionEjecuciones();
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
                title="Información adicional de Ejecución de Emisiones"
                entidad="EmisionEjecucion"
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
                    RemoveEmisionEjecucion(id);
                }}
            />
        }

        <SectionHeading title={<>Facturación - Ejecución de Emisiones</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-3">
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
                    <div className="col-12 col-md-3 col-lg-3">
                        <label htmlFor="idEmisionDefinicion" className="form-label">Número Definición</label>
                        <InputEntidad
                            name="idEmisionDefinicion"
                            title="Definición de Emisiones"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idEmisionDefinicion }
                            onChange={({target}) =>{
                                let idEmisionDefinicion = 0;
                                let descEmisionDefinicion = '';
                                if (target.row) {
                                    idEmisionDefinicion = parseInt(target.value);
                                    descEmisionDefinicion = target.row.numero;
                                }
                                formSet({...formValues, idEmisionDefinicion: idEmisionDefinicion, descEmisionDefinicion: descEmisionDefinicion});
                            }}
                            entidad="EmisionDefinicion"
                            onFormat={(row) => (row && row.id) ? `${row.numero}` : ''}
                            columns={[
                                { Header: 'Número', accessor: 'numero', width: '20%' },
                                { Header: 'Descripción', accessor: 'descripcion', width: '80%' },
                            ]}
                        />
                    </div>
                    <div className="col-12 col-md-3 col-lg-3">
                        <label htmlFor="numero" className="form-label">Número Ejecución</label>
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
                    <div className="col-12 col-md-12 col-lg-6">
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
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="periodo" className="form-label">Período</label>
                        <input
                            name="periodo"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.periodo }
                            onChange={ formHandle }
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
                />

            </div>

        </section>
        
    </>
    )
}

export default EmisionEjecucionesView;
