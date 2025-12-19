import { Modal, TableCustom } from "../../common"
import { getDateToString, getFormatNumber, getNumeroRecibo_ObjectToIdentificador } from "../../../utils/convert"
import { ServerRequest } from "../../../utils/apiweb"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { APIS } from "../../../config/apis"
import { onRequestError, onRequestNoSuccess } from "../../../utils/requests"
import { useEffect, useState } from "react"
import { useManagedContext } from "../../hooks"


const RecaudacionesGridModal = ({ idRecaudacionLote, onCancel }) => {
    
    const { setIsLoading, showMessageModal } = useManagedContext()

    const [recaudaciones, setRecaudaciones] = useState([])

    useEffect(() => {
        if (idRecaudacionLote > 0) {
            SearchRecuadaciones(idRecaudacionLote)
        }
    }, [])

    const SearchRecuadaciones = (idRecaudacionLote) => {
        setIsLoading(true)

        const paramsUrl = `/detalle/${idRecaudacionLote}`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            paramsUrl,
            null,
            res => res.json().then(data => {
                setRecaudaciones(data)
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
            allowFullscreen={true}
            size="xl"
            title="Recaudaciones"
            body={(
                <TableCustom
                    className={'TableCustomBase m-top-10'}
                    data={recaudaciones}
                    columns={[
                        { Header: 'N° control', accessor: 'numeroControl', width: '10%' },
                        { Header: 'N° cliente', accessor: 'numeroCuenta', width: '20%' },
                        { Header: 'Identificador recibo', accessor: 'numeroRecibo', width: '25%', Cell: ({ row }) => (row.original.numeroRecibo > 0) ?  getNumeroRecibo_ObjectToIdentificador(row.original) : row.original.codigoBarras },
                        { Header: 'Fecha de conciliación', accessor: 'fechaConciliacion', Cell: (data) => getDateToString(data.value), width: '15%'},
                        { Header: 'Fecha de cobro', accessor: 'fechaCobro', Cell: (data) => getDateToString(data.value), width: '15%'},
                        { Header: 'Importe ($)', accessor: 'importeCobro', Cell: (data) => getFormatNumber(data.value, 2), width: '15%', alignCell: 'right' },
                    ]}
                    showDownloadCSV={false}
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

export default RecaudacionesGridModal
