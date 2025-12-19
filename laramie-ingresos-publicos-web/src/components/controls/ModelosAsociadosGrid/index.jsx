import React, { useState, useEffect } from 'react';
import { object, bool } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ServerRequest } from '../../../utils/apiweb';
import { OpenObjectURL } from '../../../utils/helpers';
import ShowToastMessage from '../../../utils/toast';
import { TableCustom } from '../../common';
import { useLista } from '../../../components/hooks/useLista';


const ModelosAsociadosGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        list: []
    });

    const mount = () => {
        setState(prevState => {
            return {...prevState,
              list: props.data.list 
            };
        });
    }
    useEffect(mount, [props.data]);

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


    const cellD = (data) => <div className='action'>
                              <div onClick={ (event) => handleClickADownload(data.value) } className="link">
                                  <i className="fa fa-download" title="descargar"></i>
                              </div>
                            </div>

    const tableColumns = [
        { Header: 'Tipo Modelo', Cell: (props) => getDescTipoPlantillaDocumento(props.value), accessor: 'idTipoPlantillaDocumento', width: '30%' },
        { Header: 'Descripcion', accessor: 'descripcion', width: '50%' },
        { Header: '', Cell: cellD, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
    }

    //handles
    const handleClickADownload = (id) => {
  
        const rowForm = state.list.find(x => x.id === id);
        const callbackSuccess = (response) => {
        response.blob()
        .then((buffer) => {
            OpenObjectURL(rowForm.nombre, buffer);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        });
        };

        const paramsHeaders = {
            "Content-Type": "application/octet-stream"
        };
        const paramsUrl = `/${rowForm.path}`;
        ServerRequest(
            REQUEST_METHOD.GET,
            paramsHeaders,
            true,
            APIS.URLS.FILE,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
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

ModelosAsociadosGrid.propTypes = {
    disabled: bool,
    data: object.isRequired
};

ModelosAsociadosGrid.defaultProps = {
    disabled: false
  };
  

export default ModelosAsociadosGrid;