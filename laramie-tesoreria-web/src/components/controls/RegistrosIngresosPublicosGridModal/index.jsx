import { Modal, TableCustom } from "../../common"
import { getDateToString, getFormatNumber, getNumeroRecibo_ObjectToIdentificador } from "../../../utils/convert"
import { ServerRequest } from "../../../utils/apiweb"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { APIS } from "../../../config/apis"
import { onRequestError, onRequestNoSuccess } from "../../../utils/requests"
import { useEffect, useState } from "react"
import { useManagedContext } from "../../hooks"


const RegistrosIngresosPublicosGridModal = ({ idPagoRendicionLote, onCancel }) => {
    
    const { setIsLoading, showMessageModal } = useManagedContext()

    const [registrosContables, setRegistrosContables] = useState([])

    useEffect(() => {
        if (idPagoRendicionLote > 0) {
            SearchRecuadaciones(idPagoRendicionLote)
        }
    }, [])

    const SearchRecuadaciones = (idPagoRendicionLote) => {
        setIsLoading(true)

        const paramsUrl = `/detalle/${idPagoRendicionLote}`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PAGO_RENDICION_LOTE,
            paramsUrl,
            null,
            res => res.json().then(data => {
                setRegistrosContables(data)
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
            title="Rendiciones de Pago"
            body={(
                <TableCustom
                    className={'TableCustomBase m-top-10'}
                    data={registrosContables}
                    columns={[
                        { Header: 'N° recibo', accessor: 'numeroRecibo', width: '25%', Cell: ({ row }) =>  getNumeroRecibo_ObjectToIdentificador(row.original) },
                        { Header: 'Fecha de Cobro', accessor: 'fechaPago', Cell: (data) => getDateToString(data.value), width: '15%'},
                        { Header: 'Importe ($)', accessor: 'importePago', Cell: (data) => getFormatNumber(data.value, 2), width: '20%', alignCell: 'right' },
                        { Header: 'Codigo de Barras', accessor: 'codigoBarras', width: '40%' },

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

export default RegistrosIngresosPublicosGridModal
