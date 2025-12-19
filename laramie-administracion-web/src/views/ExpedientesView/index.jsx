import React, { useState, useEffect } from 'react';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ALERT_TYPE } from '../../consts/alertType';
import { APIS } from '../../config/apis';
import { useForm } from '../../components/hooks/useForm';
import { ServerRequest } from '../../utils/apiweb';
import { getDateToString  } from '../../utils/convert';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, InputLista, AdvancedSearch } from '../../components/common';
import ExpedienteModal from '../../components/controls/ExpedienteModal';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';


function ExpedientesView() {

    //hooks
    const [state, setState] = useState({
        loading: false,
        showMessage: false,
        showForm: false,
        modeFormEdit: false,
        rowId: 0,
        dataTagger: {
            showModal: false,
            idEntidad: null
        },
        list: []
    });

    const [filters, setFilters] = useState({
        labels: [
            { title: 'Tipo Expediente', field: 'descTipoExpediente', value: '', valueIgnore: ''},
            { title: 'Expediente', field: 'expediente', value: '', valueIgnore: '' },
            { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
        ]
    });

    const [ formValues, formHandle, , formSet ] = useForm({
        idTipoExpediente: 0,
        descTipoExpediente: '', //no existe como control, se usa para tomar el text del tipo
        expediente: '',
        etiqueta: ''
    });

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickExpedienteAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickExpedienteView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickExpedienteModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickExpedienteRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickExpedienteDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Expediente', Cell: (props) => {
            const row = props.row.original;
            const expediente = `${row.ejercicio}-${row.numero}-${row.letra}`;
            return expediente;
          }, id: 'expediente', accessor: 'numero', width: '70%' },
        { Header: 'Fecha creación', Cell: (data) => (data.value) ? getDateToString(data.value, false) : '', accessor: 'fechaCreacion', width: '20%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickExpedienteAdd = () => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: 0};
        });
    }
    const handleClickExpedienteView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id)};
        });
    }
    const handleClickExpedienteModify = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id)};
        });        
    }
    const handleClickExpedienteRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: parseInt(id)};
        });
    }
    const handleClickExpedienteDataTagger = (id) => {
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
    function SearchExpedientes() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                data.forEach(x => {
                    if (x.fechaCreacion) x.fechaCreacion = new Date(x.fechaCreacion);
                });
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
        `idTipoExpediente=${formValues.idTipoExpediente}&`+
        `expediente=${encodeURIComponent(formValues.expediente)}&`+
        `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EXPEDIENTE,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveExpediente(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchExpedientes();
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
            APIS.URLS.EXPEDIENTE,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    function ApplyFilters() {
        UpdateFilters();
        SearchExpedientes();
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
                title="Información adicional de Expediente"
                entidad="Expediente"
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
                    RemoveExpediente(id);
                }}
            />
        }

        {state.showForm && 
            <ExpedienteModal
                id={state.rowId}
                disabled={!state.modeFormEdit}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showForm: false};
                    });
                }}
                onConfirm={(id) => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowId: 0};
                    });
                    SearchExpedientes();
                }}
            />
        }

        <SectionHeading title={<>Expedientes</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idPersona" className="form-label">Tipo Expediente</label>
                        <InputLista
                            name="idTipoExpediente"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoExpediente }
                            onChange={({target}) =>{
                                let idTipoExpediente = 0;
                                let descTipoExpediente = '';
                                if (target.row) {
                                    idTipoExpediente = parseInt(target.value);
                                    descTipoExpediente = target.row.nombre;
                                }
                                formSet({...formValues, idTipoExpediente: idTipoExpediente, descTipoExpediente: descTipoExpediente});
                            }}
                            lista="TipoExpediente"
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="expediente" className="form-label">Expediente</label>
                        <input
                            name="expediente"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.expediente }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
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

export default ExpedientesView;
