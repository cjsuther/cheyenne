import React, { useState, useEffect } from 'react';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { useNavigate } from "react-router-dom";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { APPCONFIG } from '../../app.config';
import { useForm } from '../../components/hooks/useForm';
import ShowToastMessage from '../../utils/toast';
import { useLista } from '../../components/hooks/useLista';
import { getDateToString  } from '../../utils/convert';
import {getDateSerialize} from '../../utils/convert';
import { Loading, TableCustom, MessageModal, InputEntidad, SectionHeading, DatePickerCustom, AdvancedSearch, InputExpediente } from '../../components/common';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';
import { useEntidad } from '../../components/hooks/useEntidad';


function ApremiosView() {

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
            { title: 'Numero', field: 'numero', value: '', valueIgnore: ''},
            { title: 'Caratula', field: 'caratula', value: '', valueIgnore: '' },
            { title: 'Expediente', field: 'descExpediente', value: '', valueIgnore: '' },
            { title: 'Organismo Judicial', field: 'descOrganismoJudicial', value: '', valueIgnore: '' },
            //{ title: 'Fecha desde', field: '', value: '', valueIgnore: '' },
            //{ title: 'Fecha hasta', field: '', value: '', valueIgnore: '' }
        ]
    });

    const mount = () => {

        //SearchApremios();

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, formReset , formSet ] = useForm({
        numero: '',
        caratula: '',
        idExpediente: 0,
        descExpediente: '',
        idOrganismoJudicial: 0,
        descOrganismoJudicial: '',
        fechaInicioDemandaDesde: null,
        fechaInicioDemandaHasta: null
    });

    const [, getRowLista ] = useLista({
        listas: ['EstadoCertificadoApremio'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'EstadoCertificadoApremio',
          timeout: 0
        }
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['OrganoJudicial'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'OrganoJudicial',
          timeout: 0
        }
    });

    const getDescOrganismoJudicial = (id) => {
        const row = getRowEntidad('OrganoJudicial', id);
        return (row) ? `${row.codigoOrganoJudicial} - ${row.departamentoJudicial}` : '';
    }

    const getDescFuero = (id) => {
        const row = getRowEntidad('OrganoJudicial', id);
        return (row) ? row.fuero : '';
    }


    //definiciones
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickApremioView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickApremioModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickApremioRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickApremioDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>

    const tableColumns = [
        { Header: 'Apremio', accessor: 'numero', width: '20%' },
        { Header: 'Inicio de demanda', Cell: (data) => (data.value) ? getDateToString(data.value, false) : '', accessor: 'fechaInicioDemanda', width: '20%' },
        { Header: 'Organismo judicial', Cell: (data) => getDescOrganismoJudicial(data.value), accessor: 'idOrganismoJudicial', width: '20%' },
        { Header: 'Fuero', Cell: (data) => getDescFuero(data.value), id:'fuero', accessor: 'idOrganismoJudicial', width: '30%' },
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickApremioView = (id) => {
        const url = '/apremio/' + OPERATION_MODE.VIEW + '/' + id;
        navigate(url, { replace: true });

    }
    const handleClickApremioModify = (id) => {
        const url = '/apremio/' + OPERATION_MODE.EDIT + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickApremioRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: id};
        });
    }
    const handleClickApremioDataTagger = (id) => {
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
    function SearchApremios() {

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
        `numero=${encodeURIComponent(formValues.numero)}&`+
        `caratula=${encodeURIComponent(formValues.caratula)}&`+
        `idExpediente=${formValues.idExpediente}&`+
        `idOrganismoJudicial=${formValues.idOrganismoJudicial}&`+
        `fechaInicioDemandaDesde=${encodeURIComponent(getDateSerialize(formValues.fechaInicioDemandaDesde))}&`+
        `fechaInicioDemandaHasta=${encodeURIComponent(getDateSerialize(formValues.fechaInicioDemandaHasta))}`;


        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.APREMIO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveApremio(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchApremios();
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
            APIS.URLS.APREMIO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    function ApplyFilters() {
        UpdateFilters();
        SearchApremios();
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
                title="Información adicional de Apremio"
                entidad="Apremio"
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
                    RemoveApremio(id);
                }}
            />
        }

        <SectionHeading title={<>Legales - Apremios</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="numero" className="form-label">Número</label>
                        <input
                            name="numero"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numero }
                            onChange={ formHandle }
                         />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="caratula" className="form-label">Carátula</label>
                        <input
                            name="caratula"
                            placeholder=""
                            className="form-control"
                            value={ formValues.caratula }
                            onChange={ formHandle }
                         />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idExpediente" className="form-label">Expediente</label>
                        <InputExpediente
                            name="idExpediente"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idExpediente }
                            onChange={({target}) =>{
                                let idExpediente = 0;
                                let descExpediente = '';
                                if (target.row) {
                                    idExpediente = parseInt(target.value);
                                    descExpediente = target.row.detalleExpediente;
                                }
                                formSet({...formValues, idExpediente: idExpediente, descExpediente: descExpediente});
                            }}   
                        />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idOrganismoJudicial" className="form-label">Organismo Judicial</label>
                        <InputEntidad
                                name="idOrganismoJudicial"
                                placeholder=""
                                className="form-control"
                                value={ formValues.idOrganismoJudicial }
                                onChange={({target}) =>{
                                    let idOrganismoJudicial = 0;
                                    let descOrganismoJudicial = '';
                                    if (target.row) {
                                        idOrganismoJudicial = parseInt(target.value);
                                        descOrganismoJudicial = `${target.row.codigoOrganoJudicial} -${target.row.departamentoJudicial} `; 
                                    }
                                    formSet({...formValues, idOrganismoJudicial: idOrganismoJudicial, descOrganismoJudicial: descOrganismoJudicial});
                                }} 
                                title="Organismo Judicial"
                                entidad="OrganoJudicial"
                                onFormat= {(row) => (row) ? `${row.codigoOrganoJudicial} - ${row.departamentoJudicial}` : ''}
                                columns={[
                                    { Header: 'Codigo', accessor: 'codigoOrganoJudicial', width: '25%' },
                                    { Header: 'Departamento judicial', accessor: 'departamentoJudicial', width: '70%' }
                                ]}
                                memo={false}
                        />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="fechaInicioDemandaDesde" className="form-label">Fecha Desde</label>
                        <DatePickerCustom
                            name="fechaInicioDemandaDesde"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaInicioDemandaDesde }
                            onChange={ formHandle }
                        />
                     </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="fechaInicioDemandaHasta" className="form-label">Fecha Hasta</label>
                        <DatePickerCustom
                            name="fechaInicioDemandaHasta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaInicioDemandaHasta }
                            onChange={ formHandle }
                            minValue={formValues.fechaInicioDemandaDesde}
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

export default ApremiosView;
