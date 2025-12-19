import React, { useState, useEffect, useMemo } from 'react';
import { TableCustom, SectionHeading, Loading, AutoFilters } from '../../components/common';
import ShowToastMessage from '../../utils/toast';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { useParams } from "react-router-dom";
import { useLocalFilters } from '../../components/hooks/useLocalFilters';

function UsuarioPerfilesView() {

    //parametros
    const params = useParams();

    //hooks
    const [state, setState] = useState({
        usuario: params.idUsuario ? parseInt(params.idUsuario) : 0,
        usuarioName: '',
        showForm: false,
        loading: false,
        rowId: 0,
        listAvailablePerfiles: [],
        listAssignedPerfiles: [],
    });

    //#region filters and checks
    const filterSchema = [{ title: 'Nombre', field: 'nombre',  }]

    const [filteredAvailablePerfiles, setFiltersAvailablePerfiles, tableAvailablePerfilesRef] = useLocalFilters(state.listAvailablePerfiles)
    const [filteredAssignedPerfiles, setFiltersAssignedPerfiles, tableAssignedPerfilesRef] = useLocalFilters(state.listAssignedPerfiles)
    console.log(state.listAssignedPerfiles, filteredAssignedPerfiles, )
    const onItemsSelected = (selections, key) => {
        const result = []

        for (let i = 0; i < state[key].length; i++) {
            const item = state[key][i]
            for (let j = 0; j < selections.length; j++) {
                if (item.id == selections[j].id) {
                    result.push({ ...item, selected: selections[j].selected })
                    selections.splice(j, 1)
                    break
                }
            }
            if (result.length <= i)
                result.push(item)
        }
        setState({...state, [key]: result})
    }
    //#endregion

    const mount = () => {
        SearchUsuarioPerfiles();
    }

    useEffect(mount, []);

    useEffect(() => {
        SearchUsuario();
    }, [state.usuario])

    const tableColumns = [
        { Header: 'Código', accessor: 'codigo', width: '20%' },
        { Header: 'Nombre', accessor: 'nombre', width: '75%' },
    ]

    //handles
    const handleClickAgregar = () => {
        BindUsuarioPerfiles();
      };
    
    const handleClickQuitar = () => {
        UnbindUsuarioPerfiles();
    };

    const handleClickVolver = () => {
        const url = APPCONFIG.SITE.WEBAPP + 'usuarios';
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
    function SearchUsuario() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setState(prev => ({ ...prev, usuarioName: data.nombreApellido }));
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const paramsUrl = `/${state.usuario}`;

        ServerRequest(
            REQUEST_METHOD.GET,
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

    function SearchUsuarioPerfiles() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setState(prevState => {
                    var availablePerfiles = [];
                    var assignedPerfiles = [];
                    data.forEach( permiso => {
                        var list = permiso.selected ? assignedPerfiles : availablePerfiles
                        permiso.index = list.length;
                        permiso.selected = false;
                        list.push(permiso);
                    });

                    return {...prevState, loading: false, listAvailablePerfiles: availablePerfiles, listAssignedPerfiles: assignedPerfiles};
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

        const paramsUrl = (state.usuario) ? `/usuario/${state.usuario}` : null;

        ServerRequest(
            REQUEST_METHOD.GET,
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

    function BindUsuarioPerfiles() {

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                SearchUsuarioPerfiles();
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        var perfiles = state.listAvailablePerfiles
            .filter( perfil => perfil.selected)
            .map( perfil => perfil.id);

        const body = {
            perfiles: perfiles
        };
        
        const paramsUrl = (state.usuario) ? `/${state.usuario}/perfiles/bind` : null;

        if (perfiles.length) {
            
            setState(prevState => {
                return {...prevState, loading: true, list: []};
            });

            ServerRequest(
                REQUEST_METHOD.PUT,
                null,
                true,
                APIS.URLS.USUARIO,
                paramsUrl,
                body,
                callbackSuccess,
                callbackNoSuccess,
                callbackError
            );
        }
    }

    function UnbindUsuarioPerfiles() {

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                SearchUsuarioPerfiles();
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        var perfiles = state.listAssignedPerfiles
            .filter( perfil => perfil.selected)
            .map( perfil => perfil.id);

        const body = {
            perfiles: perfiles
        };
        
        const paramsUrl = (state.usuario) ? `/${state.usuario}/perfiles/unbind` : null;

        if (perfiles.length) {

            setState(prevState => {
                return {...prevState, loading: true, list: []};
            });

            ServerRequest(
                REQUEST_METHOD.PUT,
                null,
                true,
                APIS.URLS.USUARIO,
                paramsUrl,
                body,
                callbackSuccess,
                callbackNoSuccess,
                callbackError
            );
        }
    }


    return (
    <>
        <Loading visible={state.loading}></Loading>

        <SectionHeading title={<>Permisos del Usuario{state.usuarioName ? ` (${state.usuarioName})` : ''}</>} />

        <section className='section-accordion'>

            <div >
              <h2>Perfiles disponibles</h2>
              <hr />
            </div>

            <AutoFilters schema={filterSchema} onSearch={setFiltersAvailablePerfiles} />

            <div className="m-top-10">
                <TableCustom
                    ref={tableAvailablePerfilesRef}
                    showFilterGlobal={false}
                    showPagination={true}
                    useSelectedField={true}
                    className={'TableCustomBase'}
                    columns={tableColumns}
                    data={filteredAvailablePerfiles}
                    onItemsSelected={items => onItemsSelected(items, 'listAvailablePerfiles')}
                />
            </div>

            <div className='space'>
                <button className="btn action-button" onClick={ (event) => handleClickAgregar() } >Agregar <i className="fa fa-angle-down"></i> </button>
                <button className="btn action-button" onClick={ (event) => handleClickQuitar() } >Quitar <i className="fa fa-angle-up"></i> </button>
            </div>

            <div >
              <h2>Perfiles asignados</h2>
              <hr />
            </div>

            <AutoFilters schema={filterSchema} onSearch={setFiltersAssignedPerfiles} />

            <div className="m-top-10">
                <TableCustom
                    ref={tableAssignedPerfilesRef}
                    showFilterGlobal={false}
                    showPagination={false}
                    useSelectedField={true}
                    className={'TableCustomBase'}
                    columns={tableColumns}
                    data={filteredAssignedPerfiles}
                    onItemsSelected={items => onItemsSelected(items, 'listAssignedPerfiles')}
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

export default UsuarioPerfilesView;
