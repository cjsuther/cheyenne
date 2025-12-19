import React, { useState, useEffect } from 'react';

import { useAccess, useNav } from "../../components/hooks"
import { TableCustom, SectionHeading } from '../../components/common';
import { APIS } from '../../config/apis';
import { ALERT_TYPE } from '../../consts/alertType';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { ServerRequest } from '../../utils/apiweb';
import { DistinctArray, GetTitleFromField } from '../../utils/helpers';
import ShowToastMessage from '../../utils/toast';

import './index.scss';
import {usePermissions} from "../../components/hooks/usePermissions";
import {PERMISSIONS} from "../../consts/permissions";


function EntidadesView() {

    const navigate = useNav()

    //hooks
    const [state, setState] = useState({
        list: [],
        loading: false
    });

    const [grupo, setGrupo] = useState("");

    const listEntities = [
        { grupo: "General", subgrupo: "General", tipo: "EstadoCaja", editable: false },
        { grupo: "General", subgrupo: "General", tipo: "TipoMovimientoCaja", editable: false },
        { grupo: "General", subgrupo: "General", tipo: "MedioPago", editable: false },
        { grupo: "General", subgrupo: "General", tipo: "Banco", editable: true },
        { grupo: "General", subgrupo: "General", tipo: "Emisor", editable: true },
        { grupo: "General", subgrupo: "General", tipo: "Dependencia", editable: true },
        { grupo: "Recaudación", subgrupo: "Recaudación", tipo: "LugarPago", editable: true },
        { grupo: "Recaudación", subgrupo: "Recaudación", tipo: "OrigenRecaudacion", editable: false },
        { grupo: "Recaudación", subgrupo: "Recaudación", tipo: "Recaudadora", editable: true },
    ];

    const { hasPermission } = usePermissions();
    const canEdit = hasPermission(PERMISSIONS.LISTAS_TESORERIA_EDIT);

    const mount = () => {

        SearchEntidadDefinicion();
        
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    //definiciones
    const cellVMR = (props) => (
        <div className='action'>
            <div onClick={ (event) => handleClickEntidadView(props.value) } className="link">
                <span className="material-symbols-outlined" title="Ver">search</span>
            </div>
            {canEdit && props.row.original.editable && (
                <div onClick={ (event) => handleClickEntidadEdit(props.value) } className="link">
                    <span className="material-symbols-outlined" title="Modificar">stylus</span>
                </div>
            )}
        </div>
    )
    
    const tableColumns = [
        { Header: 'Grupo', accessor: 'grupo', width: '25%' },
        { Header: 'Sub grupo', accessor: 'subgrupo', width: '25%' },
        { Header: 'Lista', accessor: 'descripcion', width: '45%' }, 
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'tipo', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickEntidadView = (tipo) => {
        navigate({ to: `../entidad/view/${tipo}` });
    }
    const handleClickEntidadEdit = (tipo) => {
        navigate({ to: `../entidad/edit/${tipo}`, });
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

        <SectionHeading titles={[{ title: 'Configuración' }, { title: 'Administración de listas' }]} />

        <section className='section-accordion'>

            <div className='grupo'>
                <div className="col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12">
                                <div className='accordion-header-title m-left-20'>
                                    <span className='active'>Filtro por grupo</span>
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

                {grupo !== "" && (
                    <TableCustom
                        className={'TableCustomBase'}
                        columns={tableColumns}
                        data={state.list.filter(f => f.grupo.indexOf(grupo) >= 0)}
                    />
                )}

            </div>

        </section>
        
    </>
    )
}

export default EntidadesView;
