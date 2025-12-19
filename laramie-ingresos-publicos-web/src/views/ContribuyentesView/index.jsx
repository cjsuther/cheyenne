import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { APPCONFIG } from '../../app.config';
import { useForm } from '../../components/hooks/useForm';
import { useLista } from '../../components/hooks/useLista';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, SectionHeading, InputPersona } from '../../components/common';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';

import './index.scss';

function ContribuyentesView() {

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        loading: false,
        showMessage: false,
        rowId: 0,
        dataTagger: {
            showModal: false,
            entidad: '',
            idEntidad: null
        },
        list: []
    });

    const [contribuyente, setContribuyente] = useState(0);

    const [ formValues, formHandle, formReset , formSet ] = useForm({
        idPersona: 0,
        descPersona: '', //no existe como control, se usa para tomar el text de idPersona
        numeroCuenta: '',
        numeroWeb: '',
        idTipoTributo: 0,
        cuenta: {
            id: 0,
            idTipoTributo: 0,
            numeroCuenta: '',
            numeroWeb: '',
            idContribuyente: '',
            idTipoDocumentoContribuyente: 0,
            numeroDocumentoContribuyente: '',
            nombreContribuyente: '',
            detalleTributo: ''
        },
        etiqueta: ''
    });

    useEffect(() => {

        if (formValues.idPersona > 0) {
            SearchContribuyentes();
        }
        else
        {
            setState(prevState => {
                return {...prevState, list: []};
            });
        }
   
    }, [formValues.idPersona]);

    const [, getRowLista ] = useLista({
        listas: ['TipoTributo'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
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
        return (row) ? row.nombre : '';
    }

    //definiciones
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickTributoView(props) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickContribuyenteDataTagger(props) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickCtaCteCuenta(props.value) } className="link">
                                        <i className="fa fa-calculator" title="ver"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Nro. Cuenta', accessor: 'numeroCuenta', width: '15%' },
        { Header: 'Tipo Tributo', Cell: (data) => getDescTipoTributo(data.value), accessor: 'idTipoTributo', width: '20%' },
        { Header: 'Detalle', accessor: 'detalleTributo', width: '55%' },
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    // Handlers
    const handleClickTributoView = (props) => {

        const row = props.row.original;
        
        let tipoTributo = '';
        
        switch (row.idTipoTributo) {
            case 10:
                tipoTributo = '/inmueble/';
                break;
            case 11:
                tipoTributo = '/comercio/';
                break;
            case 12:
                tipoTributo = '/vehiculo/';
                break;
            case 13:
                tipoTributo = '/cementerio/';
                break;
            case 14:
                tipoTributo = '/fondeadero/';
                break;
            case 15:
                tipoTributo = '/cuenta-especial/';
                break;
        
            default:
                break;
        }

        const url = tipoTributo + OPERATION_MODE.VIEW + '/' + row.idTributo;
        navigate(url, { replace: true });
    }
    const handleClickContribuyenteDataTagger = (props) => {
        const row = props.row.original;
        const entidad = GetEntidad(row.idTipoTributo);
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, entidad: entidad, idEntidad: row.idTributo}};
        });
    }
    const handleClickCtaCteContribuyente = () => {
        const url = APPCONFIG.SITE.WEBAPP + 'cuenta-corriente/contribuyente/' + OPERATION_MODE.VIEW + '/' + contribuyente;
        window.open(url, '_blank');
    }
    const handleClickCtaCteCuenta = (idCuenta) => {
        const url = APPCONFIG.SITE.WEBAPP + 'cuenta-corriente/cuenta/' + OPERATION_MODE.VIEW + '/' + idCuenta;
        window.open(url, '_blank');
    }

    // Callbacks
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

    // Functions

    function SearchContribuyentes() {

        setState(prevState => {
            return {...prevState, loading: true, list: []};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setContribuyente(data.id);
                SearchCuentas(data.id);
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        let paramsUrl = `/persona/${formValues.idPersona}`;
        
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CONTRIBUYENTE,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function SearchCuentas(idContribuyente) {

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

        let paramsUrl = `/contribuyente/`+
        `${idContribuyente}`;
        

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CUENTA,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function GetEntidad(idTipoTributo) {
        let entidad = '';
            
        switch (idTipoTributo) {
            case 10:
                entidad = 'Inmueble';
                break;
            case 11:
                entidad = 'Comercio';
                break;
            case 12:
                entidad = 'Vehiculo';
                break;
            case 13:
                entidad = 'Cementerio';
                break;
            case 14:
                entidad = 'Fondeadero';
                break;
            case 15:
                entidad = 'Especial';
                break;
        
            default:
                break;
        }
    
        return entidad;
    }

    return (
    <>

        <Loading visible={state.loading}></Loading>

        {state.dataTagger.showModal &&
            <DataTaggerModalApi
                title="Información adicional de Tributo"
                entidad={state.dataTagger.entidad}
                idEntidad={state.dataTagger.idEntidad}
                disabled={false}
                onConfirm={() => {
                    setState(prevState => {
                        return {...prevState, dataTagger: {showModal: false, entidad: '', idEntidad: null}};
                    });
                }}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, dataTagger: {showModal: false, entidad: '', idEntidad: null}};
                    });
                }}
            />
        }

        <SectionHeading title={<>Consulta por Contribuyente</>} />

        <section className='section-accordion'>

            <div className='contribuyente'>
                <div className="col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12">
                                <div className='accordion-header-title m-left-20'>
                                    <span className='active'>Contribuyente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='accordion-body'>
                        <div className='row'>
                            <div className="col-12">
                                <InputPersona
                                    name="idPersona"
                                    placeholder="Seleccione un contribuyente"
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
                                        else {
                                            setContribuyente(0);
                                        }
                                        formSet({...formValues, idPersona: idPersona, descPersona: descPersona});
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                {contribuyente > 0 &&
                <button className="btn back-button float-end" onClick={ (event) => handleClickCtaCteContribuyente() }>Cuenta Corriente</button>
                }
            </div>
        </footer>
        
    </>
    )
}

export default ContribuyentesView;
