import { useRef, useState } from "react"
import { SectionHeading, TableCustom, WrapperAdvancedSearch } from "../../components/common"
import { LISTAS } from "../../consts/listas"
import { getDateToString } from "../../utils/convert"
import { useManagedContext, useNav } from "../../components/hooks"
import { onRequestError, onRequestNoSuccess, onRequestProcessError } from "../../utils/requests"
import { APIS } from "../../config/apis"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { ServerRequest } from "../../utils/apiweb"
import { APPCONFIG } from "../../app.config"

const EventosView = () => {
    const navigate = useNav()
    const { setIsLoading } = useManagedContext()

    const [eventos, setEventos] = useState([])
    const [tableVisible, setTableVisible] = useState(false)

    const searchRef = useRef()

    const Search = () => {
        setIsLoading(true)

        const { filters } = searchRef.current
        const params = `/filter` +
            `?idTipoEvento=${filters.idTipoEvento ?? ''}` +
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
            APIS.URLS.EVENTO,
            params,
            null,
            res => {
                res.json().then(data => {
                    setEventos(data)
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
        <SectionHeading titles={[{ title: 'Eventos' }]} />
    
        <section className='section-accordion'>
            <WrapperAdvancedSearch
                ref={searchRef}
                onSearch={Search}
                filters={[
                    {
                        title: 'Tipo de evento',
                        field: 'idTipoEvento',
                        type: 'select',
                        size: 3,
                        options: [
                            { value: 0, title: '[Sin selección]', },
                            ...LISTAS.TIPO_EVENTO.map(tipo => ({ value: tipo.id, title: tipo.nombre }))
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
                data={eventos}
                columns={[
                    { Header: 'Código', accessor: 'id', width: '15%' },
                    { Header: 'Evento', accessor: 'idTipoEvento', Cell: LISTAS.TIPO_EVENTO.getCell(), width: '12%' },
                    { Header: 'Módulo', accessor: 'idModulo', Cell: LISTAS.MODULO.getCell(), width: '15%' },
                    { Header: 'Usuario/a', accessor: 'idUsuario', width: '10%' },
                    { Header: 'Fecha/Hora', accessor: 'fecha', Cell: ({ value }) => getDateToString(value, true), width: '20%' },
                    { Header: 'Mensaje', accessor: 'mensaje', },
                ]}
                avmr={{
                    onView: (item) => {
                        const url = `${APPCONFIG.SITE.WEBAPP}evento/${item.id}`
                        window.open(url)
                    }
                }}
            />}
        </section>
    </>
}

export default EventosView
