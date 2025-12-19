import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useLista } from '../../components/hooks/useLista';
import { TableCustom, SectionHeading, Loading } from '../../components/common';
import ShowToastMessage from '../../utils/toast';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import PermisoModal from '../../components/controls/PermisoModal';
import { AutoFilters } from '../../components/common'
import { useLocalFilters } from '../../components/hooks/useLocalFilters';

function PerfilPermisosView() {

    //parametros
    const params = useParams();

    //hooks
    const [state, setState] = useState({
        perfil: params.idPerfil ? parseInt(params.idPerfil) : 0,
        perfilName: '',
        showForm: false,
        loading: false,
        rowId: 0,
        listAvailablePermisos: [],
        listAssignedPermisos: [],
    });

    useEffect(() => {
        SearchPerfilPermisos();
    }, []);

    useEffect(() => {

        // ServerRequest(
        //     REQUEST_METHOD.GET,
        //     null,
        //     true,
        //     `${APIS.URLS.PERFIL}/${state.perfil}`,
        //     null,
        //     null,
        //     (res) => {res.json().then(data => setState(prev => ({ ...prev, perfilName: data.nombre })))},
        //     (res) => {console.log('No success getting profile data', res)},
        //     (err) => {console.log('Error getting profile data', err)},
        // );
        SearchPerfil();

    }, [state.perfil])

    const [getListLista, getRowLista ] = useLista({
        listas: ['Modulo'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'Modulo',
          timeout: 0
        }
    });
    const listModulos = getListLista('Modulo')

    // #region filters and checks
    const filterSchema = [
        {
            title: 'Modulo',
            field: 'idModulo',
            type: 'list',
            options: listModulos.map(x => ({ label: x.nombre, value: x.id })),
            formatLabel: value => listModulos.find(x => x.id == value).nombre,
        },
        { title: 'Codigo', field: 'codigo',  },
        { title: 'Nombre', field: 'nombre',  },
    ]

    const [filteredAvailablePermisos, setFiltersAvailablePermisos, tableAvailablePermisosRef] = useLocalFilters(state.listAvailablePermisos)
    const [filteredAssignedPermisos, setFiltersAssignedPermisos, tableAssignedPermisosRef] = useLocalFilters(state.listAssignedPermisos)

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

    // #endregion

    //definiciones
    const cellV = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickPermisoView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                </div>

    const getDescModulo = (id) => {
        const row = getRowLista('Modulo', id);
        return (row) ? row.nombre : '';
    }

    const tableColumns = [
        { Header: 'Sistema', accessor: 'sistema', width: '10%' },
        { Header: 'Modulo', Cell: (props) => getDescModulo(props.value), accessor: 'idModulo', width: '15%' },
        { Header: 'Codigo', accessor: 'codigo', width: '35%' },
        { Header: 'Nombre', accessor: 'nombre', width: '35%' },
        { Header: '', Cell: cellV, accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ]

    //handles
    const handleClickPermisoView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, rowId: parseInt(id)};
        });
    }

    const handleClickAgregar = () => {
        BindPerfilPermisos();
      };
    
    const handleClickQuitar = () => {
        UnbindPerfilPermisos();
    };

    const handleClickVolver = () => {
        const url = APPCONFIG.SITE.WEBAPP + 'perfiles';
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
    function SearchPerfil() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setState(prev => ({ ...prev, perfilName: data.nombre }));
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const paramsUrl = `/${state.perfil}`;

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

    function SearchPerfilPermisos() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                data.sort((a,b) => (a.idModulo === b.idModulo) ? a.codigo.localeCompare(b.codigo) : a.idModulo - b.idModulo);
                setState(prevState => {
                    let availablePermisos = [];
                    let assignedPermisos = [];
                    data.forEach( permiso => {
                        let list = permiso.selected ? assignedPermisos : availablePermisos
                        permiso.index = list.length;
                        permiso.selected = false;
                        list.push(permiso);
                    });

                    return {...prevState, loading: false, listAvailablePermisos: availablePermisos, listAssignedPermisos: assignedPermisos};
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

        const paramsUrl = (state.perfil) ? `/perfil/${state.perfil}` : null;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PERMISO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    }

    function BindPerfilPermisos() {

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                SearchPerfilPermisos();
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        let permisos = state.listAvailablePermisos
            .filter( permiso => permiso.selected)
            .map( permiso => permiso.id);

        const body = {
            permisos: permisos
        };
        
        const paramsUrl = (state.perfil) ? `/${state.perfil}/permisos/bind` : null;

        if (permisos.length) {
            
            setState(prevState => {
                return {...prevState, loading: true, list: []};
            });

            ServerRequest(
                REQUEST_METHOD.PUT,
                null,
                true,
                APIS.URLS.PERFIL,
                paramsUrl,
                body,
                callbackSuccess,
                callbackNoSuccess,
                callbackError
            );
        }
    }

    function UnbindPerfilPermisos() {

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                SearchPerfilPermisos();
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        let permisos = state.listAssignedPermisos
            .filter( permiso => permiso.selected)
            .map( permiso => permiso.id);

        const body = {
            permisos: permisos
        };
        
        const paramsUrl = (state.perfil) ? `/${state.perfil}/permisos/unbind` : null;

        if (permisos.length) {

            setState(prevState => {
                return {...prevState, loading: true, list: []};
            });

            ServerRequest(
                REQUEST_METHOD.PUT,
                null,
                true,
                APIS.URLS.PERFIL,
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

        {state.showForm && 
            <PermisoModal
                id={state.rowId}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showForm: false};
                    });
                }}
            />
        }

        <SectionHeading title={<>Permisos del Perfil{state.perfilName ? ` (${state.perfilName})` : ''}</>} />

        <section className='section-accordion'>

            <div >
              <h2>Permisos disponibles</h2>
              <hr />
            </div>

            <AutoFilters schema={filterSchema} onSearch={setFiltersAvailablePermisos} />

            <div className="m-top-10">
                <TableCustom
                    ref={tableAvailablePermisosRef}
                    className={'TableCustomBase'}
                    showFilterGlobal={false}
                    showPagination={true}
                    useSelectedField={true}
                    columns={tableColumns}
                    data={filteredAvailablePermisos}
                    onItemsSelected={items => onItemsSelected(items, 'listAvailablePermisos')}
                />
            </div>

            <div className='space'>
                 <button className="btn action-button" onClick={ (event) => handleClickAgregar() } >Agregar <i className="fa fa-angle-down"></i> </button>
                 <button className="btn action-button" onClick={ (event) => handleClickQuitar() } >Quitar <i className="fa fa-angle-up"></i> </button>
            </div>

            <div >
              <h2>Permisos asignados</h2>
              <hr />
            </div>

            <AutoFilters schema={filterSchema} onSearch={setFiltersAssignedPermisos} />

            <div className="m-top-10">

                <TableCustom
                    ref={tableAssignedPermisosRef}
                    className={'TableCustomBase'}
                    showFilterGlobal={false}
                    showPagination={false}
                    useSelectedField={true}
                    columns={tableColumns}
                    data={filteredAssignedPermisos}
                    onItemsSelected={items => onItemsSelected(items, 'listAssignedPermisos')}
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

export default PerfilPermisosView;
