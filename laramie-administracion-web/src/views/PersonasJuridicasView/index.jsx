import React, { useState } from 'react';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { useForm } from '../../components/hooks/useForm';
import { useLista } from '../../components/hooks/useLista';
import { ServerRequest } from '../../utils/apiweb';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, AdvancedSearch, InputFormat } from '../../components/common';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';
import { MASK_FORMAT } from '../../consts/maskFormat';


function PersonasJuridicasView() {

    //hooks
    const [state, setState] = useState({
        loading: false,
        showForm: false,
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
            { title: 'Documento', field: 'numeroDocumento', value: '', valueIgnore: ''},
            { title: 'Denominación / Nombre de Fantasía', field: 'nombre', value: '', valueIgnore: '' },
            { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
        ]
    });

    const [ formValues, formHandle, , ] = useForm({
        numeroDocumento: '',
        nombre: '',
        etiqueta: ''
    });

    const [, getRowLista] = useLista({
        listas: ['TipoDocumento','FormaJuridica'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoDocumento_FormaJuridica',
          timeout: 0
        }
    });  
    
    const getDescTipoDocumento = (id) => {
        const row = getRowLista('TipoDocumento', id);
        return (row) ? row.nombre : '';
    }     

    const getDescFormaJuridica = (id) => {
        const row = getRowLista('FormaJuridica', id);
        return (row) ? row.nombre : '';
    }         

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickPersonaJuridicaAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickPersonaJuridicaView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickPersonaJuridicaModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickPersonaJuridicaRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickPersonaJuridicaDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Documento', Cell: (props) => {
            const row = props.row.original;
            const tipoDocumento = getDescTipoDocumento(row.idTipoDocumento);
            return `${tipoDocumento} ${row.numeroDocumento}`;
          }, id: 'documento', accessor: 'documento', width: '25%' },           
        { Header: 'Denominación', accessor: 'denominacion', width: '30%' },
        { Header: 'Forma jurídica', Cell: (props) => getDescFormaJuridica(props.value), accessor: 'idFormaJuridica', width: '35%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    

    //handles
    const handleClickPersonaJuridicaAdd = () => {
        const url = APPCONFIG.SITE.WEBAPP + 'persona-juridica/' + OPERATION_MODE.NEW;
        window.location.href = url;
    }
    const handleClickPersonaJuridicaView = (id) => {
        const url = APPCONFIG.SITE.WEBAPP + 'persona-juridica/' + OPERATION_MODE.VIEW + '/' + id;
        window.location.href = url;
    }
    const handleClickPersonaJuridicaModify = (id) => {
        const url = APPCONFIG.SITE.WEBAPP + 'persona-juridica/' + OPERATION_MODE.EDIT + '/' + id;
        window.location.href = url;
    }
    const handleClickPersonaJuridicaRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: id};
        });
    }
    const handleClickPersonaJuridicaDataTagger = (id) => {
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
    function SearchPersonasJuridicas() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });
        
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                data.forEach(x => {
                    if (x.fechaConstitucion) x.fechaConstitucion = new Date(x.fechaConstitucion);
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
        `numeroDocumento=${encodeURIComponent(formValues.numeroDocumento)}&`+
        `nombre=${encodeURIComponent(formValues.nombre)}&`+
        `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;
        
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PERSONA_JURIDICA,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );        
    }    

    function RemovePersonaJuridica(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchPersonasJuridicas();
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
            APIS.URLS.PERSONA_JURIDICA,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );        
    }


    function ApplyFilters() {
        UpdateFilters();
        SearchPersonasJuridicas();
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
                title="Información adicional de Persona Jurídica"
                entidad="PersonaJuridica"
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
                    RemovePersonaJuridica(id);
                }}
            />
        }

        <SectionHeading title={<>Personas Jurídicas</>} />

        <section className='section-accordion'>
            
            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="numeroDocumento" className="form-label">Número Documento</label>
                        <InputFormat
                            name="numeroDocumento"
                            placeholder=""
                            className="form-control"
                            mask={MASK_FORMAT.DOCUMENTO}
                            maskPlaceholder={null}
                            value={ formValues.numeroDocumento }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="nombre" className="form-label">Denominación / Nombre de Fantasía</label>
                        <input
                            name="nombre"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nombre }
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
                    limitDataSize
                />

            </div>

        </section>
        
    </>
    )
}

export default PersonasJuridicasView;
