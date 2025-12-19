import React, { useState, useEffect } from 'react';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ALERT_TYPE } from '../../consts/alertType';
import { APIS } from '../../config/apis';
import { useLista } from '../../components/hooks/useLista';
import { ServerRequest } from '../../utils/apiweb';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading } from '../../components/common';
import PlantillaDocumentoModal from '../../components/controls/PlantillaDocumentoModal';

function PlantillasDocumentosView() {

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

        SearchPlantillasDocumentos();
        
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [, getRowLista ] = useLista({
        listas: ['TipoPlantillaDocumento'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoPlantillaDocumento',
          timeout: 0
        }
    });

    const getDescTipoPlantillaDocumento = (id) => {
        const row = getRowLista('TipoPlantillaDocumento', id);
        return (row) ? row.nombre : '';
    }

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickPlantillaDocumentoAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickPlantillaDocumentoView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickPlantillaDocumentoModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickPlantillaDocumentoRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                </div>
    
    
    const tableColumns = [
        { Header: 'Tipo Plantilla', Cell: (props) => { return getDescTipoPlantillaDocumento(props.value); }, accessor: 'idTipoPlantillaDocumento', width: '40%' },
        { Header: 'Descripción', accessor: 'descripcion', width: '50%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickPlantillaDocumentoAdd = () => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: 0};
        });
    }
    const handleClickPlantillaDocumentoView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id)};
        });
    }
    const handleClickPlantillaDocumentoModify = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id)};
        });        
    }
    const handleClickPlantillaDocumentoRemove = (id) => {
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
    function SearchPlantillasDocumentos() {

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

    function RemovePlantillaDocumento(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchPlantillasDocumentos();
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
            APIS.URLS.PLANTILLA_DOCUMENTO,
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
                    RemovePlantillaDocumento(id);
                }}
            />
        }

        {state.showForm && 
            <PlantillaDocumentoModal
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
                    SearchPlantillasDocumentos();
                }}
            />
        }

        <SectionHeading title={<>Legales - Plantillas Documentos</>} />

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

export default PlantillasDocumentosView;
