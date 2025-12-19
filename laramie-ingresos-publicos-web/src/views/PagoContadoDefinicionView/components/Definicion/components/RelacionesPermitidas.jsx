import { useMemo } from "react"
import { useState } from "react"

import { Modal, TableCustom } from "../../../../../components/common"
import ListasModal from "../../../../../components/controls/ListasModal"
import { useLista } from "../../../../../components/hooks/useLista"
import { ALERT_TYPE } from "../../../../../consts/alertType"
import ShowToastMessage from "../../../../../utils/toast"
import { OPERATION_MODE } from '../../../../../consts/operationMode'


const TipoVinculos = {
    10: 'TipoVinculoInmueble',
    11: 'TipoVinculoComercio',
    12: 'TipoVinculoVehiculo',
    13: 'TipoVinculoCementerio',
    14: 'TipoVinculoFondeadero',
    15: 'TipoVinculoEspecial',
}

const RelacionesPermitidas = ({ data, setData, params, idTipoTributo }) => {
    const [open, setOpen] = useState(false)
    const [adding, setAdding] = useState(false)

    const [getListLista, , listaReady] = useLista({
        listas: ['TipoVinculoInmueble', 'TipoVinculoComercio', 'TipoVinculoVehiculo', 'TipoVinculoCementerio', 'TipoVinculoFondeadero', 'TipoVinculoEspecial'],
        onLoaded: (listas, isSuccess, error) => {
            if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        memo: {
            key: 'TipoVinculos',
            timeout: 0
        },
    })

    const entities = useMemo(() => getListLista(TipoVinculos[idTipoTributo]), [idTipoTributo, listaReady])
    const filteredData = useMemo(() => entities.filter(
        entity => data.some(item => item.state !== 'r' && entity.id === item.idTipoVinculoCuenta)
    ), [idTipoTributo, data, entities])

    const onAddConfirm = (id) => {
        if (data.find(x => x.idTipoVinculoCuenta === id))
            setData(data.map(x => x.idTipoVinculoCuenta === id ? {...x, state: 'o'} : x))
        else setData([...data, {
            id: -Date.now(),
            idPagoContadoDefinicion: parseInt(params.id),
            idTipoVinculoCuenta: id,
            state: 'a',
        }])

        setAdding(false)
    }

    const onRemove = (item) => {
        const result = []
        data.forEach(x => {
            if (x.idTipoVinculoCuenta === item.id) {
                if (x.state !== 'a') result.push({...x, state: 'r'})
            }
            else {
                result.push(x)
            }
        })
        setData(result)
    }

    const inputText = filteredData.length < 1 ? '' : (filteredData[0].nombre + (filteredData.length > 1 ? '...' : '') )

    const tableColumns = [
        { Header: 'Nombre', accessor: 'nombre', width: '95%' },
        {
            id:'ar', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true,
            Header: (props) => (params.mode === OPERATION_MODE.VIEW) ? <div/> : (
                <div className='action'>
                    <div onClick={() => setAdding(true)} className="link">
                        <i className="fa fa-plus" title="nuevo"></i>
                    </div>
                </div>
            ),
            Cell: (props) =>  (params.mode === OPERATION_MODE.VIEW) ? <div/> : (
                <div className='action'>
                    <div onClick={() => onRemove(props.row.original)} className="link">
                        <i className="fa fa-trash" title="borrar"></i>
                    </div>
                </div>
            ),
        },
    ]

    return <>
        <div className="col-12 col-md-8 col-lg-9">
            <label htmlFor="idTipoVinculoCuenta" className="form-label">Relaciones Permitidas</label>
            <input
                name="idTipoVinculoCuenta"
                type="text"
                placeholder=""
                className={(params.mode === OPERATION_MODE.VIEW) ? 'form-control input-entida link force-disabled' : 'form-control input-entidad link'}
                value={inputText}
                onClick={() => setOpen(true)}
                // disabled={params.mode === OPERATION_MODE.VIEW}
                readOnly
            />
        </div>

        <Modal
            show={open}
            title="Relaciones Permitidas"
            body={
                <div className="row">
                    <TableCustom
                        className='TableCustomBase'
                        columns={tableColumns}
                        data={filteredData}
                    />
                </div>
            }
            footer={<button className="btn btn-outline-primary" data-dismiss="modal" onClick={() => setOpen(false)}>Salir</button>}
        />

        {adding && <ListasModal
            title="Relaciones Permitidas"
            lista={TipoVinculos[idTipoTributo]}
            onDismiss={() => { setAdding(false) }}
            onConfirm={onAddConfirm}
        />}
    </>
}

export default RelacionesPermitidas
