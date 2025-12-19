import { Modal, TableCustom } from "../../common"
import { getDateToString, getFormatNumber, getNumeroRecibo_ObjectToIdentificador } from "../../../utils/convert"
import { ServerRequest } from "../../../utils/apiweb"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { APIS } from "../../../config/apis"
import { onRequestError, onRequestNoSuccess } from "../../../utils/requests"
import { useEffect, useState } from "react"
import { useManagedContext } from "../../hooks"


const RegistrosContablesGridModal = ({ idRegistroContableLote, onCancel }) => {
    
    const { setIsLoading, showMessageModal } = useManagedContext()

    const [registrosContables, setRegistrosContables] = useState([])

    useEffect(() => {
        if (idRegistroContableLote > 0) {
            SearchRecuadaciones(idRegistroContableLote)
        }
    }, [])

    const SearchRecuadaciones = (idRegistroContableLote) => {
        setIsLoading(true)

        const paramsUrl = `/detalle/${idRegistroContableLote}`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.REGISTRO_CONTABLE_LOTE,
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
            title="Registros Contables"
            body={(
                <TableCustom
                    className={'TableCustomBase m-top-10'}
                    data={registrosContables}
                    columns={[
                        { Header: 'Fecha de ingreso', accessor: 'fechaIngreso', Cell: (data) => getDateToString(data.value), width: '14%'},
                        { Header: 'Ejercicio', accessor: 'ejercicio', width: '7%' },
                        { Header: 'Jurisdicción', accessor: 'jurisdiccion', width: '13%' },
                        { Header: 'Recurso por rubro', accessor: 'recursoPorRubro', width: '13%' },
                        { Header: 'Cuenta Contable', accessor: 'cuentaContable', width: '13%' },
                        { Header: 'Importe ($)', accessor: 'importe', Cell: (data) => getFormatNumber(data.value, 2), width: '15%', alignCell: 'right' },
                        { Header: 'N° recibo', accessor: 'recaudacion', width: '15%', Cell: ({ row }) =>  getNumeroRecibo_ObjectToIdentificador(row.original.recaudacion) },
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

export default RegistrosContablesGridModal
