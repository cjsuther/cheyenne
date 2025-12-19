import { Modal, TableCustom } from "../../common"
import { getDateToString, getFormatNumber, getNumeroRecibo_ObjectToString } from "../../../utils/convert"
import { useEffect, useState } from "react"
import { useLista } from "../../hooks"
import { ALERT_TYPE } from "../../../consts/alertType"
import ShowToastMessage from "../../../utils/toast"


const movimientoInit = {
    id: 0,
    idCaja: 0,
    idCajaAsignacion: 0,
    idTipoMovimientoCaja: 0,
    importeCobro: 0,
    fechaCobro: null,
    observacion: "",
    mediosPagos: [],
    recibos: []
}

const MovimientosCajaDetalleModal = ({ movimiento, onCancel }) => {
    
    const [detalle, setDetalle] = useState(movimientoInit)

    useEffect(() => {
        if (movimiento) {
            setDetalle(movimiento)
        }
    }, [movimiento])

    const [, getRowLista ] = useLista({
        listas: ['TipoMovimientoCaja','MedioPago'],
        onLoaded: (_, isSuccess, error) => {
          if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        memo: {
          key: 'TipoMovimientoCaja_MedioPago',
          timeout: 0
        }
    })

    return (
        <Modal
            size="xl"
            title="Detalle de movimiento"
            body={(
            <>

                <label className="form-label m-top-10">Veps</label>
                <TableCustom
                    className={'TableCustomBase m-top-5'}
                    data={detalle.recibos}
                    columns={[
                        { Header: 'Cuenta', accessor: 'numeroCuenta', width: '15%' },
                        { Header: 'Número', Cell: ({ row }) => getNumeroRecibo_ObjectToString(row.original), accessor: 'numeroRecibo', width: '15%' },
                        { Header: 'Periodo', accessor: 'periodo', width: '7%' },
                        { Header: 'Cuota', accessor: 'cuota', width: '7%' },
                        { Header: 'Fecha 1° Vto.', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaVencimiento1', width: '13%' },
                        { Header: 'Imp. 1° Vto.', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeVencimiento1', width: '13%', alignCell: 'right' },
                        { Header: 'Fecha 2° Vto.', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaVencimiento2', width: '13%' },
                        { Header: 'Imp. 2° Vto.', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeVencimiento2', width: '13%', alignCell: 'right' },
                    ]}
                    showDownloadCSV={false}
                    showFilterGlobal={false}
                />

                <label className="form-label m-top-50">Medios de pago</label>
                <TableCustom
                    className={'TableCustomBase m-top-5 m-bottom-20'}
                    data={detalle.mediosPagos}
                    columns={[
                        { Header: 'Medio de pago', accessor: 'idMedioPago', width: '30%', Cell: ({ value }) => getRowLista('MedioPago', value)?.nombre ?? '' },
                        { Header: 'Entidad', accessor: 'bancoMedioPago', width: '25%' },
                        { Header: 'Número', accessor: 'numeroMedioPago', width: '25%' },
                        { Header: 'Importe de pago', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeCobro', width: '20%', alignCell: 'right' }
                    ]}
                    showDownloadCSV={false}
                    showFilterGlobal={false}
                />

            </>
            )}
            footer={(
                <div className="width-100p disp-b">
                    <button className="btn back-button m-left-5" data-dismiss="modal" onClick={onCancel}>Volver</button>
                </div>
            )}
        />
    )
}

export default MovimientosCajaDetalleModal
