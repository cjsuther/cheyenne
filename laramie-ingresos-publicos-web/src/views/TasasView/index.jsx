import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { APIS } from '../../config/apis';
import { useForm } from '../../components/hooks/useForm';
import { useLista } from '../../components/hooks/useLista';
import { useEntidad } from '../../components/hooks/useEntidad';
import { ServerRequest } from '../../utils/apiweb';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, AdvancedSearch, InputFormat } from '../../components/common';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';


function TasasView() {

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        loading: false,
        showForm: false,
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
            { title: 'Codigo', field: 'codigo', value: '', valueIgnore: ''},
            { title: 'Descripción', field: 'descripcion', value: '', valueIgnore: '' },
            { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
        ]
    });

    const [ formValues, formHandle, , ] = useForm({
        codigo: '',
        descripcion: '',
        idTipoTributo: 0,
        descTipoTributo: '',
        etiqueta: ''
    });
    
    const [, getRowLista ] = useLista({
        listas: ['TipoTributo'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoTributo',
          timeout: 0
        }
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['CategoriaTasa'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'CategoriaTasa',
          timeout: 0
        }
      });

    const getDescTipoTributo = (id) => {
        const row = getRowLista('TipoTributo', id);
        return (row) ? row.nombre : '';
    }    

    const getDescCategoriaTasa = (id) => {
        const row = getRowEntidad('CategoriaTasa', id);
        return (row) ? row.nombre : '';
    }    

    //definiciones
    const cellA = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickTasaAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                </div>
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickTasaView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickTasaModify(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickTasaRemove(props.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickTasaDataTagger(props.value) } className="link">
                                        <i className="fa fa-info-circle" title="Información adicional"></i>
                                    </div>
                                </div>

    const tableColumns = [
        { Header: 'Código', id: 'codigo', accessor: 'codigo', width: '10%' },        
        { Header: 'Descripción', accessor: 'descripcion', width: '40%' },
        { Header: 'Tipo tributo', Cell: (props) => {
            const row = props.row.original;
            const tipoTributo = getDescTipoTributo(row.idTipoTributo);
            return tipoTributo;
          }, accessor: 'tipoTributo', width: '20%' },
        { Header: 'Categoría', Cell: (props) => {
            const row = props.row.original;
            const categoriaTasa = getDescCategoriaTasa(row.idCategoriaTasa);
            return categoriaTasa;
          }, accessor: 'idCategoriaTasa', width: '20%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ]; 

    //handles
    const handleClickTasaAdd = () => {
        const url = '/tasa/' + OPERATION_MODE.NEW;
        navigate(url, { replace: true });
    }
    const handleClickTasaView = (id) => {
        const url = '/tasa/' + OPERATION_MODE.VIEW + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickTasaModify = (id) => {
        const url = '/tasa/' + OPERATION_MODE.EDIT + '/' + id;
        navigate(url, { replace: true });
    }
    const handleClickTasaRemove = (id) => {
        setState(prevState => {
            return {...prevState, showMessage: true, rowId: id};
        });
    }
    const handleClickTasaDataTagger = (id) => {
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
    function SearchTasas() {

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

        let paramsUrl = `/filter?`+
        `codigo=${encodeURIComponent(formValues.codigo)}&`+
        `descripcion=${encodeURIComponent(formValues.descripcion)}&`+
        `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;
        
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.TASA,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );        
    }

    function RemoveTasa(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchTasas();
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
            APIS.URLS.TASA,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );        
    }


    function ApplyFilters() {
        UpdateFilters();
        SearchTasas();
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
                title="Información adicional de la tasa"
                entidad="Tasa"
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
                    RemoveTasa(id);
                }}
            />
        }

        <SectionHeading title={<>Tasas</>} />

        <section className='section-accordion'>
            
            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="codigo" className="form-label">Código</label>
                        <InputFormat
                            name="codigo"
                            placeholder=""
                            className="form-control"
                            maskPlaceholder={null}
                            value={ formValues.codigo }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <input
                            name="descripcion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.descripcion }
                            onChange={ formHandle }
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

export default TasasView;
