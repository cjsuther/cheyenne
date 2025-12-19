import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { APPCONFIG } from '../../app.config';
import { useForm } from '../../components/hooks/useForm';
import ShowToastMessage from '../../utils/toast';
import { useLista } from '../../components/hooks/useLista';
import {getDateSerialize} from '../../utils/convert';
import { Loading, TableCustom, MessageModal, InputEntidad, SectionHeading, DatePickerCustom, AdvancedSearch, InputCuenta, InputLista } from '../../components/common';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';


function CertificadosApremiosView() {

    //hooks
    let navigate = useNavigate();
    
    const [state, setState] = useState({
        loading: false,
        showMessage: false,
        rowId: 0,
        dataTagger: {
            showModal: false,
            idEntidad: null
        },
        list: []
    });

    const [filters, setFilters] = useState({
        labels: [
            { title: 'Apremio', field: 'descApremio', value: '', valueIgnore: ''},
            { title: 'Cuenta', field: 'descCuenta', value: '', valueIgnore: '' },
            { title: 'Estado Certificado Apremio', field: 'descEstadoCertificadoApremio', value: '', valueIgnore: '' },
            { title: 'Número Certificado', field: 'numero', value: '', valueIgnore: '' }
            //{ title: 'Fecha Certificado Desde', field: 'fechaCertificadoDesde', value: '', valueIgnore: null },
            //{ title: 'Fecha Certificado Hasta', field: 'fechaCertificadoHasta', value: '', valueIgnore: null }
        ]
    });

    const mount = () => {

        //SearchCertificadosApremio();

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, formReset , formSet ] = useForm({
        idApremio: 0,
        descApremio: '',
        idCuenta: 0,
        descCuenta: '',
        idEstadoCertificadoApremio: 0,
        descEstadoCertificadoApremio: '',
        numero: '',
        fechaCertificadoDesde: null,
        fechaCertificadoHasta: null
    });

    const [, getRowLista ] = useLista({
        listas: ['TipoDocumento','EstadoCertificadoApremio'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'EstadoCertificadoApremio_TipoDocumento',
          timeout: 0
        }
    });

    const getDescTipoDocumento = (id) => {
        const row = getRowLista('TipoDocumento', id);
        return (row) ? row.nombre : '';
    }

    const getDescEstadoCertificadoApremio = (id) => {
        const row = getRowLista('EstadoCertificadoApremio', id);
        return (row) ? row.nombre : '';
    }

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickCertificadoApremioAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickCertificadoApremioView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {props.row.original.idEstadoCertificadoApremio !== 403 &&
                                    <div onClick={ (event) => handleClickCertificadoApremioModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    }
                                    <div onClick={ (event) => handleClickCertificadoApremioRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickCertificadoApremioDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>
    const tableColumns = [
        { Header: 'Nro. Certificado', accessor: 'numero', width: '15%' },
        { Header: 'Nro. Apremio', accessor: 'numeroApremio', width: '15%' },
        { Header: 'Estado Certificado', Cell: (data) => getDescEstadoCertificadoApremio(data.value), accessor: 'idEstadoCertificadoApremio', width: '20%' },
        { Header: 'Cuenta', accessor: 'numeroCuenta', width: '10%' },
        { Header: 'Titular', Cell: (data) => 
                                    `${data.row.original.nombreContribuyente} 
                                    (${getDescTipoDocumento(data.row.original.idTipoDocumentoContribuyente)}
                                    ${data.row.original.numeroDocumentoContribuyente})`
                                    , width: '30%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickCertificadoApremioAdd = () => {
        const url = '/certificado-apremio-nuevo';
        navigate(url, { replace: true });
    }
    const handleClickCertificadoApremioView = (id) => {
        const url = '/certificado-apremio/' + OPERATION_MODE.VIEW + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickCertificadoApremioModify = (id) => {
        const url = '/certificado-apremio/' + OPERATION_MODE.EDIT + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickCertificadoApremioRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: id};
        });
    }
    const handleClickCertificadoApremioDataTagger = (id) => {
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
    function SearchCertificadosApremio() {

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

        const paramsUrl = '/filter?' +
        `idApremio=${formValues.idApremio}&`+
        `idCuenta=${formValues.idCuenta}&`+
        `idEstadoCertificadoApremio=${formValues.idEstadoCertificadoApremio}&`+
        `numero=${encodeURIComponent(formValues.numero)}&`+
        `fechaCertificadoDesde=${encodeURIComponent(getDateSerialize(formValues.fechaCertificadoDesde))}&`+
        `fechaCertificadoHasta=${encodeURIComponent(getDateSerialize(formValues.fechaCertificadoHasta))}`;


        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CERTIFICADO_APREMIO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveCertificadoApremio(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchCertificadosApremio();
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
            APIS.URLS.CERTIFICADO_APREMIO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    function ApplyFilters() {
        UpdateFilters();
        SearchCertificadosApremio();
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
                title="Información adicional de Certificado Apremio"
                entidad="CertificadoApremio"
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
                    RemoveCertificadoApremio(id);
                }}
            />
        }

        <SectionHeading title={<>Legales - Certificados</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idApremio" className="form-label">Apremio</label>
                        <InputEntidad
                            name="idApremio"
                            placeholder=""
                            className="form-control"
                            onChange={formHandle}
                            value={ formValues.idApremio }
                            title="Apremio"
                            entidad="Apremio"
                            onFormat={(row) => (row && row.id) ? `Número: ${row.numero} - Caratula: ${row.caratula}` : ''}
                            columns={[
                                { Header: 'Número', accessor: 'numero', width: '25%' },
                                { Header: 'Caratula', accessor: 'caratula', width: '70%' }
                            ]}
                        />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idCuenta" className="form-label">Cuenta</label>
                        <InputCuenta
                            name="idCuenta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idCuenta }
                            onChange={({target}) =>{
                                let idCuenta = 0;
                                let descCuenta = '';
                                if (target.row) {
                                    idCuenta = parseInt(target.value);
                                    descCuenta = target.row.numeroCuenta;
                                }
                                formSet({...formValues, idCuenta: idCuenta, descCuenta: descCuenta});
                            }}                            
                        />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idEstadoCertificadoApremio" className="form-label">Estado Certificado</label>
                        <InputLista
                            name="idEstadoCertificadoApremio"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idEstadoCertificadoApremio }
                            onChange={({target}) =>{
                                let idEstadoCertificadoApremio = 0;
                                let descEstadoCertificadoApremio = '';
                                if (target.row) {
                                    idEstadoCertificadoApremio = parseInt(target.value);
                                    descEstadoCertificadoApremio = target.row.nombre;
                                }
                                formSet({...formValues, idEstadoCertificadoApremio: idEstadoCertificadoApremio, descEstadoCertificadoApremio: descEstadoCertificadoApremio});
                            }}
                            lista="EstadoCertificadoApremio"
                        />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="numero" className="form-label">Número Certificado</label>
                        <input
                            name="numero"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numero }
                            onChange={ formHandle }
                         />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="fechaCertificadoDesde" className="form-label">Fecha Certificado Desde</label>
                        <DatePickerCustom
                            name="fechaCertificadoDesde"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaCertificadoDesde }
                            onChange={ formHandle }
                        />
                     </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="fechaCertificadoHasta" className="form-label">Fecha Certificado Hasta</label>
                        <DatePickerCustom
                            name="fechaCertificadoHasta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaCertificadoHasta }
                            onChange={ formHandle }
                            minValue={formValues.fechaCertificadoDesde}
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

export default CertificadosApremiosView;
