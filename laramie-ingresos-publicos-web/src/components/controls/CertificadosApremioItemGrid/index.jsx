import React, { useState, useEffect } from 'react';
import { object } from 'prop-types';
import { useEntidad } from '../../hooks/useEntidad';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { TableCustom } from '../../common';
import { getFormatNumber } from '../../../utils/convert';


const CertificadosApremioItemGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCertificadoApremio: 0,
        list: []
    });

    const mount = () => {
        setState(prevState => {
            const list = props.data.list;
            return {...prevState,
                idCertificadoApremio: props.data.idCertificadoApremio,
                list: list };
        });
    }
    useEffect(mount, [props.data]);

    const [, getRowEntidad] = useEntidad({
        entidades: ['SubTasa'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'SubTasa',
          timeout: 0
        }
    });

    const getDescSubTasa = (id) => {
        const row = getRowEntidad('SubTasa', id);
        return (row) ? row.codigo + " - " + row.descripcion : '';
    }

    const tableColumns = [
        { Header: 'Periodo', accessor: 'periodo', width: '8%', alignCell: 'right' },
        { Header: 'Cuota', accessor: 'cuota', width: '8%', alignCell: 'right' },
        { Header: 'Importe', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'monto', width: '8%', alignCell: 'right' },
        { Header: 'Recargo', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'montoRecargo', width: '8%', alignCell: 'right' },
        { Header: 'Total', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'montoTotal', width: '8%', alignCell: 'right' },
        { Header: 'Sub Tasa', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasa', width: '20%' }
    ];

    return (
    <>

        <TableCustom
            showFilterGlobal={true}
            showPagination={true}
            className={'TableCustomBase'}
            columns={tableColumns}
            data={ state.list }
        />

    </>
    );
}

CertificadosApremioItemGrid.propTypes = {
    data: object.isRequired
};
  

export default CertificadosApremioItemGrid;