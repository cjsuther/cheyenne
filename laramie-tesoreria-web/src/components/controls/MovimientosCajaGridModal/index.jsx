import { Modal, TableCustom } from "../../common"
import { getDateToString, getFormatNumber } from "../../../utils/convert"
import { ServerRequest } from "../../../utils/apiweb"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { APIS } from "../../../config/apis"
import { onRequestError, onRequestNoSuccess } from "../../../utils/requests"
import { useEffect, useState } from "react"
import { useLista, useManagedContext } from "../../hooks"
import { ALERT_TYPE } from "../../../consts/alertType"
import ShowToastMessage from "../../../utils/toast"


const cajaDtoInit = {
    caja: {
        id: 0,
        codigo: '',
        nombre: '',
        orden: 0,
        idDependencia: 0,
        idEstadoCaja: 0,
        idUsuarioActual: 0,
        idCajaAsignacionActual: 0,
        idRecaudadora: 0
    },
    asignacion: {
        id: 0,
        idCaja: 0,
        idUsuario: 0,
        fechaApertura: null,
        fechaCierre: null,
        importeSaldoInicial: 0,
        importeSaldoFinal: 0,
        idRecaudacionLote: 0
    },
    movimientos: []
}

const MovimientosCajaGridModal = ({ idCajaAsignacion, onCancel }) => {
    
    const { setIsLoading } = useManagedContext()

    const [cajaResumen, setCajaResumen] = useState(cajaDtoInit)

    useEffect(() => {
        if (idCajaAsignacion > 0) {
            FindCaja_Resumen(idCajaAsignacion)
        }
    }, [])

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

    const FindCaja_Resumen = (idCajaAsignacion) => {
        setIsLoading(true)

        const paramsUrl = `/resumen/caja-asignacion/${idCajaAsignacion}`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            null,
            res => res.json().then(cajaDto => {
                setCajaResumen(cajaDto)
                setIsLoading(false)
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }

    return (
        <Modal
            size="xl"
            title="Movimientos"
            body={(
                <TableCustom
                    className={'TableCustomBase m-top-10'}
                    data={cajaResumen.movimientos}
                    columns={[
                        { Header: 'Tipo de movimiento', accessor: 'idTipoMovimientoCaja', width: '20%', Cell: ({ value }) => getRowLista('TipoMovimientoCaja', value)?.nombre ?? '' },
                        { Header: 'Fecha de movimiento', Cell: (data) => getDateToString(data.value, true), accessor: 'fechaCobro', width: '20%'},
                        { Header: 'Importe ($)', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeCobro', width: '15%', alignCell: 'right' },
                        { Header: 'Observación', accessor: 'observacion', width: '45%' },
                    ]}
                    showDownloadCSV={false}
                    showFilterGlobal={false}
                />
            )}
            footer={(
                <div className="width-100p disp-b">
                    <button className="btn back-button m-left-5" data-dismiss="modal" onClick={onCancel}>Volver</button>
                </div>
            )}
        />
    )
}

export default MovimientosCajaGridModal
