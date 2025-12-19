import { useRef, useState } from "react"
import { SectionHeading, TableCustom, WrapperAdvancedSearch } from "../../components/common"
import { LISTAS } from "../../consts/listas"
import { getDateToString } from "../../utils/convert"
import { useManagedContext, useNav } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { onRequestError, onRequestNoSuccess, onRequestProcessError } from "../../utils/requests"
import { APPCONFIG } from "../../app.config"

const AlertasView = () => {
    const navigate = useNav()
    const { setIsLoading } = useManagedContext()

    const [alertas, setAlertas] = useState([])
    const [tableVisible, setTableVisible] = useState(false)

    const searchRef = useRef()

    const Search = () => {
        setIsLoading(true)

        const { filters } = searchRef.current
        const params = `/filter` +
            `?idTipoAlerta=${filters.idTipoAlerta ?? ''}` +
            `&idModulo=${filters.idModulo ?? ''}` +
            `&idUsuario=${filters.idUsuario ?? ''}` +
            `&fechaDesde=${filters.fechaDesde ?? ''}` +
            `&fechaHasta=${filters.fechaHasta ?? ''}` +
            `&origen=${filters.origen ?? ''}` +
            `&mensaje=${filters.mensaje ?? ''}`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.ALERTA,
            params,
            null,
            res => {
                res.json().then(data => {
                    setAlertas(data)
                    setTableVisible(true)
                    setIsLoading(false)
                }).catch(err => {
                    onRequestProcessError(err)
                    setIsLoading(false)
                })
            },
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

    return <>
        <SectionHeading titles={[{ title: 'Alertas' }]} />
    
        <section className='section-accordion'>
            <WrapperAdvancedSearch
                ref={searchRef}
                onSearch={Search}
                filters={[
                    {
                        title: 'Tipo de alerta',
                        field: 'idTipoAlerta',
                        type: 'select',
                        size: 3,
                        options: [
                            { value: 0, title: '[Sin selección]', },
                            ...LISTAS.TIPO_ALERTA.map(tipo => ({ value: tipo.id, title: tipo.nombre }))
                        ],
                    },
                    {
                        title: 'Módulo',
                        field: 'idModulo',
                        type: 'select',
                        size: 3,
                        options: [
                            { value: 0, title: '[Sin selección]', },
                            ...LISTAS.MODULO.map(tipo => ({ value: tipo.id, title: tipo.nombre }))
                        ],
                    },
                    { title: 'Usuario/a', field: 'usuario', type: 'string', size: 6, searchOnEnter: true, },
                    { title: 'Fecha desde', field: 'fechaDesde', type: 'date', size: 3 },
                    { title: 'Fecha hasta', field: 'fechaHasta', minValueField: 'fechaDesde', type: 'date', size: 3 },
                ]}
            />

            {tableVisible && <TableCustom
                className={'TableCustomBase m-top-20'}
                data={alertas}
                columns={[
                    { Header: 'Código', accessor: 'id', width: '15%' },
                    { Header: 'Alerta', accessor: 'idTipoAlerta', Cell: LISTAS.TIPO_ALERTA.getCell(), width: '12%' },
                    { Header: 'Módulo', accessor: 'idModulo', Cell: LISTAS.MODULO.getCell(), width: '15%' },
                    { Header: 'Usuario/a', accessor: 'idUsuario', width: '10%' },
                    { Header: 'Fecha/Hora', accessor: 'fecha', Cell: ({ value }) => getDateToString(value, true), width: '20%' },
                    { Header: 'Mensaje', accessor: 'mensaje', },
                ]}
                avmr={{
                    onView: (item) => {
                        const url = `${APPCONFIG.SITE.WEBAPP}alerta/${item.id}`
                        window.open(url)
                    }
                }}
            />}
        </section>
    </>
}

export default AlertasView
