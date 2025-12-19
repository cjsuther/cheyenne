import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { object } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import { OPERATION_MODE } from '../../../consts/operationMode';
import { APPCONFIG } from '../../../app.config';
import ShowToastMessage from '../../../utils/toast';
import { TableCustom } from '../../common';
import { useLista } from '../../../components/hooks/useLista';


const CertificadosApremiosGrid = (props) => {

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        idApremio: 0,
        list: []
    });

    const mount = () => {
        setState(prevState => {
            const list = props.data.list;
            return {...prevState,
              idApremio: props.data.idApremio,
              list: list };
        });
    }
    useEffect(mount, [props.data]);

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

    const cellV = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickCertificadoView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                </div>

    const tableColumns = [
        { Header: 'Nro. Certificado', accessor: 'numero', width: '15%' },
        { Header: 'Estado Certificado', Cell: (data) => getDescEstadoCertificadoApremio(data.value), accessor: 'idEstadoCertificadoApremio', width: '30%' },
        { Header: 'Cuenta', accessor: 'numeroCuenta', width: '15%' },
        { Header: 'Titular', Cell: (data) => 
                                    `${data.row.original.nombreContribuyente} 
                                    (${getDescTipoDocumento(data.row.original.idTipoDocumentoContribuyente)}
                                    ${data.row.original.numeroDocumentoContribuyente})`
                                    , width: '35%' },
        { Header: '', Cell: cellV, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickCertificadoView = (id) => {
      const url = '/certificado-apremio/' + OPERATION_MODE.VIEW + '/' + id;
      navigate(url, { replace: true });
    }

    return (
    <>

        <TableCustom
            showFilterGlobal={false}
            showPagination={false}
            className={'TableCustomBase'}
            columns={tableColumns}
            data={ state.list }
        />

    </>
    );
}

CertificadosApremiosGrid.propTypes = {
    data: object.isRequired
};
  

export default CertificadosApremiosGrid;