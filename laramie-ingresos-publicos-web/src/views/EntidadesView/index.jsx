import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { TableCustom, SectionHeading } from '../../components/common';
import { APIS } from '../../config/apis';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { ServerRequest } from '../../utils/apiweb';
import { DistinctArray, GetTitleFromField } from '../../utils/helpers';
import ShowToastMessage from '../../utils/toast';

import './index.scss';


function EntidadesView() {

    let navigate = useNavigate();

    //hooks
    const [state, setState] = useState({
        list: [],
        loading: false
    });

    const [grupo, setGrupo] = useState("");

    let listEntities = [
        { grupo: "Inmuebles", subgrupo: "Obras", tipo: "TipoObraSuperficie", editable: true },
        { grupo: "Inmuebles", subgrupo: "Obras", tipo: "DestinoSuperficie", editable: true },
        { grupo: "Tributos", subgrupo: "Valuaciones", tipo: "TipoValuacion", editable: true },
        { grupo: "Inmuebles", subgrupo: "Obras", tipo: "TipoObra", editable: true },
        { grupo: "Inmuebles", subgrupo: "Obras", tipo: "DestinoObra", editable: true },
        { grupo: "Inmuebles", subgrupo: "Obras", tipo: "FormaPresentacionObra", editable: true },
        { grupo: "Inmuebles", subgrupo: "Obras", tipo: "FormaCalculoObra", editable: true },
        { grupo: "Inmuebles", subgrupo: "Edesur", tipo: "FrecuenciaFacturacion", editable: true },
        { grupo: "Tributos", subgrupo: "Débitos automáticos", tipo: "TipoSolicitudDebitoAutomatico", editable: true },
        { grupo: "Vehículos", subgrupo: "Vehículo", tipo: "MotivoBajaVehiculo", editable: true },
        { grupo: "Vehículos", subgrupo: "Vehículo", tipo: "OrigenFabricacion", editable: true },
        { grupo: "Vehículos", subgrupo: "Vehículo", tipo: "Combustible", editable: true },
        { grupo: "Vehículos", subgrupo: "Vehículo", tipo: "FinalidadVehiculo", editable: true },
        { grupo: "Cementerios", subgrupo: "Inhumados", tipo: "MotivoFallecimiento", editable: true },
        { grupo: "Cementerios", subgrupo: "Inhumados", tipo: "TipoOrigenInhumacion", editable: true },
        { grupo: "Cementerios", subgrupo: "Inhumados", tipo: "TipoDestinoInhumacion", editable: true },
        { grupo: "Cementerios", subgrupo: "Inhumados", tipo: "Cementerio", editable: true },
        { grupo: "Comercios", subgrupo: "Inspecciones", tipo: "MotivoInspeccion", editable: true },
        { grupo: "Comercios", subgrupo: "Verificaciones", tipo: "ResultadoVerificacion", editable: true },
        { grupo: "Comercios", subgrupo: "Rubros", tipo: "TipoPropiedad", editable: true },
        { grupo: "Comercios", subgrupo: "Rubros", tipo: "BloqueoEmision", editable: true },
        { grupo: "Certificados de Escribanos", subgrupo: "Certificados de Escribanos", tipo: "TipoCertificado", editable: true },
        { grupo: "Legal", subgrupo: "Plantillas Documentos", tipo: "TipoPlantillaDocumento", editable: true },
        { grupo: "Legal", subgrupo: "Certificados", tipo: "InspeccionCertificadoApremio", editable: true },
        { grupo: "Sub Tasas", subgrupo: "Imputaciones", tipo: "TipoCuota", editable: true },
        { grupo: "Legal", subgrupo: "Apremio", tipo: "TipoCitacion", editable: true },
        { grupo: "Controladores", subgrupo: "Controladores", tipo: "TipoControlador", editable: true },
        { grupo: "Tributos", subgrupo: "Tributos", tipo: "EstadoCuenta", editable: false },
        { grupo: "Tributos", subgrupo: "Tributos", tipo: "TipoTributo", editable: false },
        { grupo: "Tributos", subgrupo: "Tributos", tipo: "EstadoCarga", editable: false },
        { grupo: "Tributos", subgrupo: "Tributos", tipo: "Filtro", editable: false },
        { grupo: "Inmuebles", subgrupo: "Lados del Terreno", tipo: "TipoLado", editable: false },
        { grupo: "Inmuebles", subgrupo: "Personas del Inmueble", tipo: "TipoVinculoInmueble", editable: false },
        { grupo: "Comercios", subgrupo: "Personas del Comercio", tipo: "TipoVinculoComercio", editable: false },
        { grupo: "Vehículos", subgrupo: "Personas del Vehículo", tipo: "TipoVinculoVehiculo", editable: false },
        { grupo: "Cementerios", subgrupo: "Personas del Cementerio", tipo: "TipoVinculoCementerio", editable: false },
        { grupo: "Fondeaderos", subgrupo: "Personas del Fondeadero", tipo: "TipoVinculoFondeadero", editable: false },
        { grupo: "Cuentas Especiales", subgrupo: "Personas de la Cuenta Especial", tipo: "TipoVinculoEspecial", editable: false },
        { grupo: "Facturación", subgrupo: "Aprobaciones", tipo: "Ordenamiento", editable: false },
        { grupo: "Facturación", subgrupo: "Aprobaciones", tipo: "OrdenamientoGeneral", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "TipoVariable", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "CategoriaFuncion", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "Numeracion", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "TipoMovimiento", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EstadoEmisionDefinicion", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "TipoEmisionCalculo", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EstadoEmisionEjecucion", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EstadoEmisionEjecucionCuenta", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EstadoEmisionCalculoResultado", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EstadoEmisionConceptoResultado", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EstadoEmisionCuentaCorrienteResultado", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EstadoEmisionImputacionContableResultado", editable: false },
        { grupo: "Cuenta Corriente", subgrupo: "Cuenta Corriente", tipo: "LugarPago", editable: false },
        { grupo: "Cuenta Corriente", subgrupo: "Cuenta Corriente", tipo: "TipoValor", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EmisionProceso", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EstadoAprobacion", editable: false },
        { grupo: "Facturación", subgrupo: "Emisiones", tipo: "EstadoProceso", editable: false },
        { grupo: "Legal", subgrupo: "Certificados", tipo: "EstadoCertificadoApremio", editable: false },
        { grupo: "Personas", subgrupo: "Personas", tipo: "TipoDocumento", editable: false },
        { grupo: "Tributos", subgrupo: "Tributos", tipo: "Obra", editable: true },
        { grupo: "Inmuebles", subgrupo: "Superficies", tipo: "TipoSuperficie", editable: true },
        { grupo: "Inmuebles", subgrupo: "Superficies", tipo: "GrupoSuperficie", editable: true },
        { grupo: "Tributos", subgrupo: "Condiciones Especiales", tipo: "TipoCondicionEspecial", editable: true },
        { grupo: "Tributos", subgrupo: "Personas del Tributo", tipo: "TipoInstrumento", editable: true },
        { grupo: "Tributos", subgrupo: "Clase de Elemento", tipo: "ClaseElemento", editable: false },
        { grupo: "Tributos", subgrupo: "Tipo de Elemento", tipo: "TipoElemento", editable: true },
        { grupo: "Tributos", subgrupo: "Unidad de Medida", tipo: "UnidadMedida", editable: false },
        { grupo: "Comercios", subgrupo: "Comercios", tipo: "Rubro", editable: true },
        { grupo: "Tributos", subgrupo: "Excenciones", tipo: "TipoRecargoDescuento", editable: true },
        { grupo: "Vehículos", subgrupo: "Vehículos", tipo: "IncisoVehiculo", editable: true },
        { grupo: "Vehículos", subgrupo: "Vehículos", tipo: "TipoVehiculo", editable: true },
        { grupo: "Vehículos", subgrupo: "Vehículos", tipo: "CategoriaVehiculo", editable: true },
        { grupo: "Comercios", subgrupo: "Comercios", tipo: "RubroLiquidacion", editable: true },
        { grupo: "Comercios", subgrupo: "Comercios", tipo: "ZonaTarifaria", editable: true },
        { grupo: "Cementerios", subgrupo: "Cementerios", tipo: "TipoConstruccionFuneraria", editable: true },
        { grupo: "Comercios", subgrupo: "Comercios", tipo: "TipoRubroComercio", editable: true },
        { grupo: "Comercios", subgrupo: "Rubros", tipo: "RubroProvincia", editable: true },
        { grupo: "Comercios", subgrupo: "Rubros", tipo: "RubroBCRA", editable: true },
        { grupo: "Comercios", subgrupo: "Rubros", tipo: "MotivoBajaRubroComercio", editable: true },
        { grupo: "Comercios", subgrupo: "Rubros", tipo: "UbicacionComercio", editable: true },
        { grupo: "Cementerios", subgrupo: "Inhumados", tipo: "Cocheria", editable: true },
        { grupo: "Cementerios", subgrupo: "Inhumados", tipo: "RegistroCivil", editable: true },
        { grupo: "Tasas", subgrupo: "Tasas", tipo: "CategoriaTasa", editable: true },
        { grupo: "Comercios", subgrupo: "Rubros", tipo: "TipoAnuncio", editable: true },
        { grupo: "Comercios", subgrupo: "Rubros", tipo: "CategoriaUbicacion", editable: true },
        { grupo: "Comercios", subgrupo: "Comercios", tipo: "MotivoBajaComercio", editable: true },
        { grupo: "Certificados de Escribanos", subgrupo: "Certificados de Escribanos", tipo: "ObjetoCertificado", editable: true },
        { grupo: "Certificados de Escribanos", subgrupo: "Certificados de Escribanos", tipo: "Escribano", editable: true },
        { grupo: "Comercios", subgrupo: "Declaraciones Juradas", tipo: "TipoDDJJ", editable: true },
    ];

    const mount = () => {

        SearchEntidadDefinicion();
        
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    //definiciones
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickEntidadView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {props.row.original.editable &&
                                    <div onClick={ (event) => handleClickEntidadEdit(props.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    }
                                </div>
    
    
    const tableColumns = [
        { Header: 'Grupo', accessor: 'grupo', width: '25%' },
        { Header: 'Sub Grupo', accessor: 'subgrupo', width: '25%' },
        { Header: 'Lista', accessor: 'descripcion', width: '45%' }, 
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'tipo', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickEntidadView = (tipo) => {
        navigate("../entidad/" + OPERATION_MODE.VIEW + "/" + tipo, { replace: true });
    }
    const handleClickEntidadEdit = (tipo) => {
        navigate("../entidad/" + OPERATION_MODE.EDIT + "/" + tipo, { replace: true });
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
    function SearchEntidadDefinicion() {

        setState(prevState => {
            return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
            response.json()
            .then((definiciones) => {               
                setState(prevState => {
                    return {...prevState, loading: false};
                });

                for (let i=0; i < listEntities.length; i++) {
                    let entidad = listEntities[i];
                    const definicion = definiciones.find(f => f.tipo === entidad.tipo);
                    entidad.descripcion = (definicion) ? definicion.descripcion : GetTitleFromField(entidad.tipo);
                }
                listEntities.sort((a,b) => a.grupo.localeCompare(b.grupo));
                setState({list: listEntities});
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };
    
        const paramsUrl = `/definicion`;
    
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.ENTIDAD,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }


    return (
    <>

        <SectionHeading title={<>Administración de Listas</>} />

        <section className='section-accordion'>

            <div className='grupo'>
                <div className="col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12">
                                <div className='accordion-header-title m-left-20'>
                                    <span className='active'>Filtro por Grupo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='accordion-body'>
                        <div className='row'>
                            <div className="col-3">
                            <select
                                name="grupo"
                                className="form-control"
                                value={grupo}
                                onChange={({ target }) => {
                                    setGrupo(target.value);
                                }}
                            >
                            <option value=""></option>
                            {DistinctArray(state.list.map(x => x.grupo)).map((grupo, index) =>
                            <option value={grupo} key={index}>{grupo}</option>
                            )}
                            </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="m-top-20">

                <TableCustom
                    className={'TableCustomBase'}
                    columns={tableColumns}
                    data={state.list.filter(f => f.grupo.indexOf(grupo) >= 0)}
                    showPagination={false}
                />

            </div>

        </section>
        
    </>
    )
}

export default EntidadesView;
