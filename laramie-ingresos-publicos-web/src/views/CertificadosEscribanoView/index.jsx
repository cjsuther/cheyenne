import React, { useState, useEffect } from 'react';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ALERT_TYPE } from '../../consts/alertType';
import { APIS } from '../../config/apis';
import { useForm } from '../../components/hooks/useForm';
import { ServerRequest } from '../../utils/apiweb';
import { getDateToString  } from '../../utils/convert';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, InputLista, InputCuenta, InputEntidad, InputEjercicio, AdvancedSearch } from '../../components/common';
import CertificadoEscribanoModal from '../../components/controls/CertificadoEscribanoModal';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';
import { useEntidad } from '../../components/hooks/useEntidad';


function CertificadosEscribanoView() {

    //hooks
    const [state, setState] = useState({
        loading: false,
        showMessage: false,
        showForm: false,
        modeFormEdit: false,
        rowId: 0,
        dataTagger: {
            showModal: false,
            idEntidad: null
        },
        list: []
    });

    const [filters, setFilters] = useState({
        labels: [
            { title: 'Año Certificado', field: 'anioCertificado', value: '', valueIgnore: ''},
            { title: 'Número Certificado', field: 'numeroCertificado', value: '', valueIgnore: '' },
            { title: 'Tipo Certificado', field: 'descTipoCertificado', value: '', valueIgnore: '' },
            { title: 'Escribano', field: 'descEscribano', value: '', valueIgnore: '' },
            { title: 'Cuenta', field: 'descCuenta', value: '', valueIgnore: '' },
            { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
        ]
    });

    const [ formValues, formHandle, , formSet ] = useForm({
        anioCertificado: '',
        numeroCertificado: '',
        idTipoCertificado: 0,
        descTipoCertificado: '',
        idEscribano: 0,
        descEscribano: '',
        idCuenta: 0,
        descCuenta: '',
        etiqueta: ''
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['ObjetoCertificado'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'ObjetoCertificado',
          timeout: 0
        }
      });

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickCertificadoEscribanoAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickCertificadoEscribanoView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickCertificadoEscribanoModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickCertificadoEscribanoRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickCertificadoEscribanoDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>
    
    const getObjeto = (id) => {
        const row = getRowEntidad('ObjetoCertificado', id);
        return (row) ? row.nombre : '';
      }
    
    const tableColumns = [
        { Header: 'Año', accessor: 'anioCertificado', width: '10%' },
        { Header: 'Nro. de Certificado', accessor: 'numeroCertificado', width: '15%' },
        { Header: 'Objeto', Cell: (data) => getObjeto(data.value), accessor: 'idObjetoCertificado', width: '20%' },
        { Header: 'Transferencia', accessor: 'transferencia', width: '30%' },
        { Header: 'Fecha Entrada', Cell: (data) => (data.value) ? getDateToString(data.value, false) : '', accessor: 'fechaEntrada', width: '15%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickCertificadoEscribanoAdd = () => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: 0};
        });
    }
    const handleClickCertificadoEscribanoView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id)};
        });
    }
    const handleClickCertificadoEscribanoModify = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: true, rowId: parseInt(id)};
        });        
    }
    const handleClickCertificadoEscribanoRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: parseInt(id)};
        });
    }
    const handleClickCertificadoEscribanoDataTagger = (id) => {
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
    function SearchCertificadosEscribano() {

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

        const paramsUrl = `/filter?`+
        `anioCertificado=${formValues.anioCertificado}&`+
        `numeroCertificado=${encodeURIComponent(formValues.numeroCertificado)}&`+
        `idTipoCertificado=${encodeURIComponent(formValues.idTipoCertificado)}&`+
        `idEscribano=${encodeURIComponent(formValues.idEscribano)}&`+
        `idCuenta=${encodeURIComponent(formValues.idCuenta)}&`+
        `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CERTIFICADO_ESCRIBANO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveCertificadoEscribano(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchCertificadosEscribano();
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
            APIS.URLS.CERTIFICADO_ESCRIBANO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    function ApplyFilters() {
        UpdateFilters();
        SearchCertificadosEscribano();
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
                title="Información adicional de Certificado Escribano"
                entidad="CertificadoEscribano"
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
                    RemoveCertificadoEscribano(id);
                }}
            />
        }

        {state.showForm && 
            <CertificadoEscribanoModal
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
                    SearchCertificadosEscribano();
                }}
            />
        }

        <SectionHeading title={<>Escribanos - Certificados</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="anioCertificado" className="form-label">Año Certificado</label>
                        <InputEjercicio
                            name="anioCertificado"
                            placeholder=""
                            className="form-control"
                            value={ formValues.anioCertificado }
                            onChange={ formHandle }
                        />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="numeroCertificado" className="form-label">Número Certificado</label>
                        <input
                            name="numeroCertificado"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numeroCertificado }
                            onChange={ formHandle }
                        />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idTipoCertificado" className="form-label">Tipo Certificado</label>
                        <InputLista
                            name="idTipoCertificado"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoCertificado }
                            onChange={({target}) =>{
                                let idTipoCertificado = 0;
                                let descTipoCertificado = '';
                                if (target.row) {
                                    idTipoCertificado = parseInt(target.value);
                                    descTipoCertificado = target.row.nombre;
                                }
                                formSet({...formValues, idTipoCertificado: idTipoCertificado, descTipoCertificado: descTipoCertificado});
                            }}
                            lista="TipoCertificado"
                        />
                     </div>
                     <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idEscribano" className="form-label">Escribano</label>
                        <InputEntidad
                            name="idEscribano"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idEscribano }
                            onChange={({target}) =>{
                                let idEscribano = 0;
                                let descEscribano = '';
                                if (target.row) {
                                    idEscribano = parseInt(target.value);
                                    descEscribano = target.row.nombre;
                                }
                                formSet({...formValues, idEscribano: idEscribano, descEscribano: descEscribano});
                            }}                            
                            entidad="Escribano"
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
                        <label htmlFor="etiqueta" className="form-label">Etiqueta</label>
                        <input
                            name="etiqueta"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.etiqueta }
                            onChange={ formHandle }
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

export default CertificadosEscribanoView;
