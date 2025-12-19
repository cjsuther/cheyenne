import React, { useRef, useState } from 'react';

import { TableCustom, WrapperAdvancedSearch } from '../../components/common'
import { useManagedContext, useNav } from '../../components/hooks'
import { ServerRequestAsync } from '../../utils/apiweb';
import { REQUEST_METHOD } from '../../consts/requestMethodType';
import { APIS } from '../../config/apis';
import { onRequestError } from '../../utils/requests';
import { LISTAS } from '../../consts/listas';
import { getDateToString } from '../../utils/convert';
import { APPCONFIG } from '../../app.config';

function HomeView() {
    const navigate = useNav()
    const { setIsLoading } = useManagedContext()

    const [items, setItems] = useState([])
    const [tableVisible, setTableVisible] = useState(false)

    const searchRef = useRef()

    const Search = () => {
        setIsLoading(true)

        const { filters } = searchRef.current

        const tipos = [
            { nombre: 'Evento', url: APIS.URLS.EVENTO, },
            { nombre: 'Alerta', url: APIS.URLS.ALERTA,  },
            { nombre: 'Incidencia', url: APIS.URLS.INCIDENCIA, },
        ].filter(tipo => filters.tipo == 0 || tipo.nombre === filters.tipo)

        const params = `/filter` +
            `?idModulo=${filters.idModulo ?? ''}` +
            `&idUsuario=${filters.idUsuario ?? ''}` +
            `&fechaDesde=${filters.fechaDesde ?? ''}` +
            `&fechaHasta=${filters.fechaHasta ?? ''}`

        const promises = tipos.map(async tipo => {
            const results = await (await ServerRequestAsync(REQUEST_METHOD.GET, null, true, tipo.url, params)).json()
            return results.map(result => ({ ...result, tipo: tipo.nombre }))
        })

        Promise.all(promises).then(async results => {
            setItems(results.reduce((prev, curr) => [...prev, ...curr], []))
            setTableVisible(true)
        }).catch(err => {
            onRequestError(err)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const avmr = {
        onView: (item) => {
            const endpoints = {
                'Evento': 'evento',
                'Alerta': 'alerta',
                'Incidencia': 'incidencia',
            }

            const url = `${APPCONFIG.SITE.WEBAPP}${endpoints[item.tipo]}/${item.id}`
            window.open(url)
        }
    }

    return <>

        <section className='section-accordion'>
            <WrapperAdvancedSearch
                ref={searchRef}
                filters={[
                    {
                        title: 'Tipo de colección',
                        field: 'tipo',
                        type: 'select',
                        size: 3,
                        options: [
                            { value: 0, title: '[Sin selección]', },
                            { value: 'Evento', title: 'Evento', },
                            { value: 'Alerta', title: 'Alerta', },
                            { value: 'Incidencia', title: 'Incidencia', },
                        ],
                    },
                    {
                        title: 'Módulo',
                        field: 'idModulo',
                        type: 'select',
                        size: 3,
                        options: [
                            { value: 0, title: '[Sin selección]', },
                            ...LISTAS.MODULO.getValues().map(tipo => ({ value: tipo.id, title: tipo.nombre }))
                        ],
                    },
                    { title: 'Usuario/a', field: 'usuario', type: 'string', size: 6, searchOnEnter: true, },
                    { title: 'Fecha desde', field: 'fechaDesde', type: 'date', size: 3 },
                    { title: 'Fecha hasta', field: 'fechaHasta', minValueField: 'fechaDesde', type: 'date', size: 3 },
                ]}
                onSearch={Search}
            />

            {tableVisible && (
                <TableCustom
                    className={'TableCustomBase m-top-20'}
                    columns={[
                        { Header: 'Código', accessor: 'id', width: '15%' },
                        { Header: 'Colección', accessor: 'tipo', width: '12%' },
                        { Header: 'Módulo', accessor: 'idModulo', Cell: LISTAS.MODULO.getCell(), width: '15%' },
                        { Header: 'Usuario/a', accessor: 'idUsuario', width: '10%' },
                        { Header: 'Fecha/Hora', accessor: 'fecha', Cell: ({ value }) => getDateToString(value, true), width: '20%' },
                        { Header: 'Mensaje', accessor: 'mensaje', },
                    ]}
                    data={items}
                    avmr={avmr}
                />
            )}
        </section>
    </>
}

export default HomeView;
