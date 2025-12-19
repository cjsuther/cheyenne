import React, { useState } from 'react';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ALERT_TYPE } from '../../consts/alertType';
import { APIS } from '../../config/apis';
import { useForm } from '../../components/hooks/useForm';
import { ServerRequest } from '../../utils/apiweb';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, InputLista, AdvancedSearch } from '../../components/common';
import { useLista } from '../../components/hooks/useLista';
import VariableModal from '../../components/controls/VariableModal';


function VariablesView() {

    //hooks
    const [state, setState] = useState({
        loading: false,
        showMessage: false,
        showForm: false,
        modeFormEdit: false,
        rowId: 0,
        listAll: [],
        list: []
    });

    const [filters, setFilters] = useState({
        labels: [
            { title: 'Tipo Tributo', field: 'descTipoTributo', value: '', valueIgnore: ''},
            { title: 'Código / Descripción', field: 'codigo', value: '', valueIgnore: '' },
            { title: 'Activo', field: 'activo', value: '', valueIgnore: '' }
        ]
    });

    const [ formValues, formHandle, , formSet ] = useForm({
        idTipoTributo: 0,
        descTipoTributo: '', //no existe como control, se usa para tomar el text del tipo
        codigo: '',
        activo: ''
    });

    const [, getRowLista ] = useLista({
        listas: ['TipoTributo'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            SearchVariables();
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoTributo',
          timeout: 0
        }
    });

    const getDescTipoTributo = (id) => {
        const row = getRowLista('TipoTributo', id);
        return (row) ? row.nombre : 'Todos los tributos';
    }

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickVariableAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickVariableView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickVariableModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickVariableRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Tipo Tributo', Cell: (props) => {
            const row = props.row.original;
            const tipoTributo = getDescTipoTributo(row.idTipoTributo);
            return tipoTributo;
          }, id: 'tipoTributo', accessor: 'id', width: '15%' },
        { Header: 'Código', accessor: 'codigo', width: '15%' },
        { Header: 'Descripción', accessor: 'descripcion', width: '36%' },
        { Header: 'Global', Cell: (props) => {
            const row = props.row.original;
            return (row.global) ? 'Sí' : 'No';
          }, id: 'global', accessor: 'id', width: '8%' },
        { Header: 'Predef.', Cell: (props) => {
            const row = props.row.original;
            return (row.predefinido) ? 'Sí' : 'No';
            }, id: 'predefinido', accessor: 'id', width: '8%' },        
        { Header: 'Activo', Cell: (props) => {
            const row = props.row.original;
            return (row.activo) ? 'Sí' : 'No';
          }, id: 'activo', accessor: 'id', width: '8%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickVariableAdd = () => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: 0};
        });
    }
    const handleClickVariableView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id)};
        });
    }
    const handleClickVariableModify = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id)};
        });        
    }
    const handleClickVariableRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: parseInt(id)};
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
    function SearchVariables() {

        setState(prevState => {
            return {...prevState, loading: true, listAll: [], list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setState(prevState => {
                    return {...prevState,
                        loading: false,
                        listAll: data,
                        list: FilterVariables(data)
                    };
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

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.VARIABLE,
            null,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function FilterVariables(data) {
        let newData = data;

        if (formValues.idTipoTributo > 0) {
            newData = newData.filter(f => f.idTipoTributo === null || f.idTipoTributo === formValues.idTipoTributo);
        }
        if (formValues.codigo.length > 0) {
            newData = newData.filter(f => `${f.codigo}|${f.descripcion}`.indexOf(formValues.codigo) >= 0);
        }
        if (formValues.activo) {
            newData = newData.filter(f => f.activo);
        }

        return newData;
    }

    function RemoveVariable(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchVariables();
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
            APIS.URLS.VARIABLE,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    function ApplyFilters() {
        UpdateFilters();
        setState(prevState => {
            return {...prevState, list: FilterVariables(state.listAll)};
        });
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
                    RemoveVariable(id);
                }}
            />
        }

        {state.showForm && 
            <VariableModal
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
                    SearchVariables();
                }}
            />
        }

        <SectionHeading title={<>Variables</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
                initShowFilters={false}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="idPersona" className="form-label">Tipo Tributo</label>
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
                            textItemZero="[Todos los tributos]"
                        />  
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                        <label htmlFor="codigo" className="form-label">Código / Descripción</label>
                        <input
                            name="codigo"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.codigo }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3 form-check">
                        <label htmlFor="activo" className="form-check-label">Sólo activo</label>
                        <input
                            name="activo"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            checked={formValues.activo}
                            onChange={formHandle}
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

export default VariablesView;
