import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ALERT_TYPE } from '../../consts/alertType';
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading } from '../../components/common';
import EntidadModal from '../../components/controls/EntidadModal';
import { OPERATION_MODE } from '../../consts/operationMode';
import { useNav } from '../../components/hooks';


function EntidadView() {

    //parametros url
    const params = useParams();
    const navigate = useNav()

    //variables
    const definitionInit = {
        id: 0,
        tipo: '',
        descripcion: '',
        nombre1: '',
        nombre2: '',
        nombre3: '',
        nombre4: '',
        nombre5: '',
        nombre6: '',
        nombre7: '',
        nombre8: '',
        nombre9: '',
        nombre10: '',
        descripcion1: '',
        descripcion2: '',
        descripcion3: '',
        descripcion4: '',
        descripcion5: '',
        descripcion6: '',
        descripcion7: '',
        descripcion8: '',
        descripcion9: '',
        descripcion10: '',
        tipoDato1: '',
        tipoDato2: '',
        tipoDato3: '',
        tipoDato4: '',
        tipoDato5: '',
        tipoDato6: '',
        tipoDato7: '',
        tipoDato8: '',
        tipoDato9: '',
        tipoDato10: '',
        obligatorio1: false,
        obligatorio2: false,
        obligatorio3: false,
        obligatorio4: false,
        obligatorio5: false,
        obligatorio6: false,
        obligatorio7: false,
        obligatorio8: false,
        obligatorio9: false,
        obligatorio10: false
    };

    //hooks
    const [state, setState] = useState({
        mode: params.mode,
        loading: false,
        showMessage: false,
        showForm: false,
        modeFormEdit: false,
        rowId: 0,
        list: []
    });

    const [definition, setDefinition] = useState(definitionInit);


    const mount = () => {

        SearchEntidadDefinicion();
        
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    {state.mode === OPERATION_MODE.EDIT &&
                                    <div onClick={ (event) => handleClickEntidadAdd() } className="link">
                                        <span className="material-symbols-outlined" title="Nuevo">add</span>
                                    </div>
                                    }
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickEntidadView(props.value) } className="link">
                                        <span className="material-symbols-outlined" title="Ver">search</span>
                                    </div>
                                    {state.mode === OPERATION_MODE.EDIT &&
                                    <div onClick={ (event) => handleClickEntidadModify(props.value) } className="link">
                                        <span className="material-symbols-outlined" title="Modificar">stylus</span>
                                    </div>
                                    }
                                    {state.mode === OPERATION_MODE.EDIT &&
                                    <div onClick={ (event) => handleClickEntidadRemove(props.value) } className="link">
                                        <span className="material-symbols-outlined" title="Eliminar">delete</span>
                                    </div>
                                    }
                                </div>
    
    
    const tableColumns = [
        { Header: 'Código', accessor: 'codigo', width: '15%' },
        { Header: 'Nombre', accessor: 'nombre', width: '65%' },
        { Header: 'Orden', accessor: 'orden', width: '10%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickVolver = () => {
        navigate({ to: `../entidades` });
    }
    const handleClickEntidadAdd = () => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: 0};
        });
    }
    const handleClickEntidadView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id)};
        });
    }
    const handleClickEntidadModify = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id)};
        });        
    }
    const handleClickEntidadRemove = (id) => {
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
    function SearchEntidadDefinicion() {
    
        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
            response.json()
            .then((definiciones) => {               
                setState(prevState => {
                  return {...prevState, loading: false};
                });
                const definicion = definiciones.find(f => f.tipo === params.tipo);
                if (definicion) {
                    setDefinition(definicion);
                }
                SearchEntidades();
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                  return {...prevState, loading: false};
                });
            });
        };
    
        const paramsUrl = `/definicion`;
    
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.ENTIDAD,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    
    function SearchEntidades() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                const list = data[params.tipo];
                list.sort((a, b) => a.orden - b.orden);
                setState(prevState => {
                    return {...prevState, loading: false, list: list};
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

        const paramsUrl = `/${params.tipo}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.ENTIDAD,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveEntidad(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchEntidades();
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const paramsUrl = `/${definition.tipo}/${id}`;

        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.ENTIDAD,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    return (
    <>

        <Loading visible={state.loading}></Loading>

        {state.showMessage && 
            <MessageModal
                title={"Confirmación"}
                message={"¿Está seguro/a de borrar el registro?"}
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
                    RemoveEntidad(id);
                }}
            />
        }

        {state.showForm && 
            <EntidadModal
                id={state.rowId}
                definition={definition}
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
                    SearchEntidades();
                }}
            />
        }

        <SectionHeading
            titles={[
                { title: 'Configuración' },
                { title: 'Administración de listas', url: '/entidades' },
                { title: definition.descripcion }
            ]}
            />

        <section className='section-accordion'>

            <div className="m-top-20">

                <TableCustom
                    className={'TableCustomBase'}
                    columns={tableColumns}
                    data={state.list}
                />

            </div>

        </section>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
            </div>
        </footer>
        
    </>
    )
}

export default EntidadView;
