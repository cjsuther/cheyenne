import React, { useState, useEffect, useMemo } from 'react';

import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { APPCONFIG } from '../../app.config';

import { Loading, TableCustom, MessageModal, SectionHeading } from '../../components/common';
import ShowToastMessage from '../../utils/toast';
import PerfilModal from '../../components/controls/PerfilModal';


function PerfilesView() {

    //hooks
    const [state, setState] = useState({
        loading: false,
        showMessage: false,
        showForm: false,
        modeFormEdit: false,
        rowId: 0,
        list: []
    });

    const mount = () => {

        SearchPerfiles();

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickPerfilAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMRB = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickPerfilView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickPerfilModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickPerfilRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickPerfilBind(props.value) } className="link">
                                        <i className="fa fa-link" title="asignar permisos"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Código', accessor: 'codigo', width: '20%' },
        { Header: 'Nombre', accessor: 'nombre', width: '70%' },
        { Header: cellA, Cell: cellVMRB, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickPerfilAdd = () => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: 0};
        });
    }
    const handleClickPerfilView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id)};
        });
    }
    const handleClickPerfilModify = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id)};
        });
    }
    const handleClickPerfilRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: parseInt(id)};
        });
    }
    const handleClickPerfilBind = (id) => {
        const url = APPCONFIG.SITE.WEBAPP + 'perfil/permisos/' + id;
        window.location.href = url;
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
    function SearchPerfiles() {

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

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PERFIL,
            null,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemovePerfil(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchPerfiles();
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
            APIS.URLS.PERFIL,
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
                    RemovePerfil(id);
                }}
            />
        }

        {state.showForm && 
            <PerfilModal
                id={state.rowId}
                disabled={!state.modeFormEdit}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowId: 0};
                    });
                }}
                onConfirm={(id) => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowId: 0};
                    });
                    SearchPerfiles();
                }}
            />
        }

        <SectionHeading title={<>Administración de Perfiles</>} />
    
        <section className='section-accordion'>

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

export default PerfilesView;
