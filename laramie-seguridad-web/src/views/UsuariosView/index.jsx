import React, { useState, useEffect, useMemo } from 'react';

import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { APPCONFIG } from '../../app.config';

import { Loading, TableCustom, MessageModal, SectionHeading } from '../../components/common';
import ShowToastMessage from '../../utils/toast';
import UsuarioModal from '../../components/controls/UsuarioModal';


function UsuariosView() {

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

        SearchUsuarios();

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickUsuarioAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMRB = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickUsuarioView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickUsuarioModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickUsuarioRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickUsuarioBind(props.value) } className="link">
                                        <i className="fa fa-link" title="asignar perfiles"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Código', accessor: 'codigo', width: '20%' },
        { Header: 'Nombre y Apellido', accessor: 'nombreApellido', width: '40%' },
        { Header: 'E-Mail', accessor: 'email', width:'30%', disableSortBy: true },
        { Header: cellA, Cell: cellVMRB, accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickUsuarioAdd = () => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: 0};
        });
    }
    const handleClickUsuarioView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id)};
        });
    }
    const handleClickUsuarioModify = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id)};
        });
    }
    const handleClickUsuarioRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: parseInt(id)};
        });
    }
    const handleClickUsuarioBind = (id) => {
        const url = APPCONFIG.SITE.WEBAPP + 'usuario/perfiles/' + id;
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
    function SearchUsuarios() {

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
            APIS.URLS.USUARIO,
            null,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveUsuario(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchUsuarios();
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
            APIS.URLS.USUARIO,
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
                    RemoveUsuario(id);
                }}
            />
        }

        {state.showForm && 
            <UsuarioModal
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
                    SearchUsuarios();
                }}
            />
        }

        <SectionHeading title={<>Administración de Usuarios</>} />

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

export default UsuariosView;
