import React, { useState } from 'react';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ALERT_TYPE } from '../../consts/alertType';
import { APIS } from '../../config/apis';
import { useForm } from '../../components/hooks/useForm';
import { ServerRequest } from '../../utils/apiweb';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, InputEntidad, InputPersona, AdvancedSearch } from '../../components/common';
import { useLista } from '../../components/hooks/useLista';
import { useEntidad } from '../../components/hooks/useEntidad';
import ControladorModal from '../../components/controls/ControladorModal';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';

function ControladoresView() {

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
            { title: 'Tipo Controlador', field: 'descTipoControlador', value: '', valueIgnore: ''},
            { title: 'Persona', field: 'descPersona', value: '', valueIgnore: ''},
            { title: 'Supervisor', field: 'descControladorSupervisor', value: '', valueIgnore: '' },
            { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
        ]
    });

    const [ formValues, formHandle, , formSet ] = useForm({
        idTipoControlador: 0,
        descTipoControlador: '', //no existe como control, se usa para tomar el text del tipo
        idPersona: 0,
        descPersona: '', //no existe como control, se usa para tomar el text de idPersona
        idControladorSupervisor: 0,
        descControladorSupervisor: '', //no existe como control, se usa para tomar el text de supervisor
        etiqueta: ''
    });

    const [, getRowLista ] = useLista({
        listas: ['TipoDocumento'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            SearchControladores();
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoDocumento',
          timeout: 0
        }
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['TipoControlador'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoControlador',
          timeout: 0
        }
    });

    const getDescTipoControlador = (id) => {
        const row = getRowEntidad('TipoControlador', id);
        return (row) ? row.nombre : '';
    }

    const getDescTipoDocumento = (id) => {
        const row = getRowLista('TipoDocumento', id);
        return (row) ? row.nombre : '';
    }

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickControladorAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickControladorView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickControladorModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickControladorRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickControladorDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Tipo Controlador', Cell: (props) => getDescTipoControlador(props.value), accessor: 'idTipoControlador', width: '25%' },
        { Header: 'Documento', Cell: (props) => {
            const row = props.row.original;
            const tipoDocumento = getDescTipoDocumento(row.idTipoDocumento);
            return `${tipoDocumento} ${row.numeroDocumento}`;
        }, id: 'documento', accessor: 'documento', width: '25%' },
        { Header: 'Nombre y Apellido', accessor: 'nombrePersona', width: '40%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickControladorAdd = () => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: 0};
        });
    }
    const handleClickControladorView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id)};
        });
    }
    const handleClickControladorModify = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id)};
        });        
    }
    const handleClickControladorRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: parseInt(id)};
        });
    }
    const handleClickControladorDataTagger = (id) => {
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
    function SearchControladores() {

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
        `idTipoControlador=${formValues.idTipoControlador}&`+
        `idPersona=${formValues.idPersona}&`+
        `idControladorSupervisor=${formValues.idControladorSupervisor}&`+
        `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CONTROLADOR,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveControlador(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchControladores();
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
            APIS.URLS.CONTROLADOR,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    function ApplyFilters() {
        UpdateFilters();
        SearchControladores();
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
                title="Información adicional de Controlador"
                entidad="Controlador"
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
                    RemoveControlador(id);
                }}
            />
        }

        {state.showForm && 
            <ControladorModal
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
                    SearchControladores();
                }}
            />
        }

        <SectionHeading title={<>Controladores</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idTipoControlador" className="form-label">Tipo Controlador</label>
                        <InputEntidad
                            name="idTipoControlador"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoControlador }
                            onChange={({target}) =>{
                                let idTipoControlador = 0;
                                let descTipoControlador = '';
                                if (target.row) {
                                    idTipoControlador = parseInt(target.value);
                                    descTipoControlador = target.row.nombre;
                                }
                                formSet({...formValues, idTipoControlador: idTipoControlador, descTipoControlador: descTipoControlador});
                            }}
                            title="Tipo Controlador"
                            entidad="TipoControlador"
                            onFormat= {(row) => (row) ? `${row.codigo} - ${row.nombre}` : ''}
                        />                        
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idControladorSupervisor" className="form-label">Supervisor</label>
                        <InputEntidad
                            name="idControladorSupervisor"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idControladorSupervisor }
                            onChange={({target}) =>{
                                let idControladorSupervisor = 0;
                                let descControladorSupervisor = '';
                                if (target.row) {
                                    idControladorSupervisor = parseInt(target.value);
                                    descControladorSupervisor = target.row.nombrePersona;
                                }
                                formSet({...formValues, idControladorSupervisor: idControladorSupervisor, descControladorSupervisor: descControladorSupervisor});
                            }}
                            title="Supervisor"
                            entidad="Controlador"
                            onFormat={(row) => (row && row.id) ? `${row.nombrePersona} (Legajo: ${row.legajo})` : ''}
                            filter={(row) => { return row.esSupervisor; }}
                            columns={[
                                { Header: 'Legajo', accessor: 'legajo', width: '25%' },
                                { Header: 'Nombre y Apellido', accessor: 'nombrePersona', width: '70%' }
                            ]}
                            memo={false}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
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
                    <div className="col-12 col-md-6 col-lg-2">
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

export default ControladoresView;
