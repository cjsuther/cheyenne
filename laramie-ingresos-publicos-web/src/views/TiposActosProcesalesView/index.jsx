import React, { useState, useEffect } from 'react';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ALERT_TYPE } from '../../consts/alertType';
import { APIS } from '../../config/apis';
import { useLista } from '../../components/hooks/useLista';
import { ServerRequest } from '../../utils/apiweb';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading } from '../../components/common';
import TipoActoProcesalModal from '../../components/controls/TipoActoProcesalModal';

function TiposActosProcesalesView() {

    //hooks
    const [state, setState] = useState({
        loading: false,
        showMessage: false,
        showForm: false,
        modeFormEdit: false,
        addChildren: false,
        rowId: 0,
        list: []
    });
    
    const [plantillasDocumentos, setPlantillasDocumentos] = useState([]);

    const mount = () => {

        SearchTiposActosProcesales();
        SearchPlantillasDocumentos();
        
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickTipoActoProcesalAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickTipoActoProcesalView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickTipoActoProcesalModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickTipoActoProcesalRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickTipoActoProcesalAddChildren(props.value) } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
   
    
    const tableColumns = [
        { Header: 'Tipo Acto Procesal', Cell: (props) => {
            const row = props.row.original;
            return `${row.codigoActoProcesal} - ${row.descripcion}`;
          }, accessor: 'tipoActoProcesal', width: '90%' }, 
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickTipoActoProcesalAdd = () => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: 0, addChildren: false};
        });
    }
    const handleClickTipoActoProcesalView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id), addChildren: false};
        });
    }
    const handleClickTipoActoProcesalModify = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id), addChildren: false};
        });        
    }
    const handleClickTipoActoProcesalRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: parseInt(id)};
        });
    }
    const handleClickTipoActoProcesalAddChildren = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id), addChildren: true};
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
    function SearchTiposActosProcesales() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                data.forEach(x => {
                    if (x.fechaBaja) x.fechaBaja = new Date(x.fechaBaja);
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


        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.TIPO_ACTO_PROCESAL,
            null,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function SearchPlantillasDocumentos() {

        setState(prevState => {
            return {...prevState, loading: true};
        });
        setPlantillasDocumentos([]);

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                data.forEach(x => {
                    if (x.fecha) x.fecha = new Date(x.fecha);
                });
                setPlantillasDocumentos(data);
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
            APIS.URLS.PLANTILLA_DOCUMENTO,
            null,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveTipoActoProcesal(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchTiposActosProcesales();
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
            APIS.URLS.TIPO_ACTO_PROCESAL,
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
                    RemoveTipoActoProcesal(id);
                }}
            />
        }

        {state.showForm && 
            <TipoActoProcesalModal
                id={state.rowId}
                disabled={!state.modeFormEdit}
                addChildren={state.addChildren}
                list={plantillasDocumentos}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showForm: false};
                    });
                }}
                onConfirm={(id) => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowId: 0};
                    });
                    SearchTiposActosProcesales();
                }}
            />
        }

        <SectionHeading title={<>Legales - Tipos Actos Procesales</>} />

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

export default TiposActosProcesalesView;
