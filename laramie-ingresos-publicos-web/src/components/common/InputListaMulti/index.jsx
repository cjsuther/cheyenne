import { useMemo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from "../../../components/hooks/useLista"
import ShowToastMessage from '../../../utils/toast';
import { Modal, TableCustom } from "../../../components/common";
import ListasModal from "../../../components/controls/ListasModal";
import { useEntidad } from "../../hooks/useEntidad";
import EntidadesModal from "../../controls/EntidadesModal";
import { OPERATION_MODE } from "../../../consts/operationMode";

const InputListaMulti = ({ title, name, type, idField, data, setData, newItemFiller, className, disabled, debug }) => {
    const [open, setOpen] = useState(false)
    const [adding, setAdding] = useState(false)

    const [entities, setEntities] = useState([])
    const filteredData = useMemo(() => {
        const unfound = [...data]
        const result = entities.filter(x => {
            for (let i = 0; i < unfound.length; i++) {
                const item = unfound[i]
                if (item[idField] === x.id) {
                    unfound.splice(i, 1)
                    return item.state !== 'r'
                }
            }
        })
        return result
    }, [data, entities])

    const [getListLista, , listaReady] = useLista({
        listas: [name],
        onLoaded: (listas, isSuccess, error) => {
            if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        // memo: {
        //     key: name,
        //     timeout: 0
        // }
    })

    const [getListEntidad, , entidadReady] = useEntidad({
        entidades: [name],
        onLoaded: (entidades, isSuccess, error) => {
            if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        // memo: {
        //     key: name,
        //     timeout: 0
        // }
    })

    useEffect(() => {
        setEntities(type === 'lista' ? getListLista(name) : getListEntidad(name))
    }, [name, listaReady, entidadReady])

    const onAdd = () => {
        setAdding(true)
    }

    const onAddConfirm = (id) => {
        if (data.find(x => x[idField] === id))
            setData(data.map(x => x[idField] === id ? {...x, state: 'o'} : x))
        else setData([...data, {
            id: -Date.now(),
            [idField]: id,
            state: 'a',
            ...newItemFiller,
        }])
        setAdding(false)
    }

    const onRemove = (item) => {
        const result = []
        data.forEach(x => {
            if (x[idField] === item.id) {
                if (x.state !== 'a') result.push({...x, state: 'r'})
            }
            else {
                result.push(x)
            }
        })
        setData(result)
    }

    const onClickModalExit = () => {
        setOpen(false)
    }

    const tableColumns = [
        { Header: 'Nombre', accessor: 'nombre', width: '95%' },
        {
            id:'ar', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true,
            Header: (props) => disabled ? <div/> : (
                <div className='action'>
                    <div onClick={onAdd} className="link">
                        <i className="fa fa-plus" title="nuevo"></i>
                    </div>
                </div>
            ),
            Cell: (props) =>  disabled ? <div/> : (
                <div className='action'>
                    <div onClick={() => onRemove(props.row.original)} className="link">
                        <i className="fa fa-trash" title="borrar"></i>
                    </div>
                </div>
            ),
        },
    ]
    
    const inputText = filteredData.length < 1 ? '' : (filteredData[0].nombre + (filteredData.length > 1 ? '...' : '') )

    return <>
        <div className={className || "col-12 col-md-6 col-lg-4"}>
            <label htmlFor={name} className="form-label">{title}</label>
            <input
                name={name}
                type="text"
                placeholder=""
                className={disabled ? 'form-control input-entida link force-disabled' : 'form-control input-entidad link'}
                value={inputText}
                onClick={() => setOpen(true)}
                // disabled={disabled}
                readOnly
            />
        </div>

        <Modal
            show={open}
            title={title}
            body={
                <div className="row">
                    <TableCustom
                        showFilterGlobal={false}
                        showPagination={false}
                        showDownloadCSV={false}
                        className='TableCustomBase'
                        columns={tableColumns}
                        data={filteredData}
                    />
                </div>
            }
            footer={<button className="btn btn-outline-primary" data-dismiss="modal" onClick={onClickModalExit}>Salir</button>}
        />

        {adding && (type === 'lista'
            ? <ListasModal
                {...{title, lista: name }}
                onDismiss={() => { setAdding(false) }}
                onConfirm={onAddConfirm}
                onClickRow={onAddConfirm}
                /* tableColumns={names === undefined ? undefined : [{ Header: 'Nombre', Cell: ({ row: { original } }) => `${original.tipo.split('Vinculo')[1]} - ${original.nombre}`, accessor: 'nombre', width: '95%' }]} */
            />
            : <EntidadesModal
                {...{title, entidad: name}}
                onDismiss={() => { setAdding(false) }}
                onConfirm={onAddConfirm}
                onClickRow={onAddConfirm}
                columns={[{ Header: 'Nombre', accessor: 'nombre', width: '95%' }]}
            />
        )}
    </>
}

export default InputListaMulti
