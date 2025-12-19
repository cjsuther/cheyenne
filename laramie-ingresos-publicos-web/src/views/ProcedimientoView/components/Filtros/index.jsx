import { useEffect, useState } from "react"
import { AccordionIcon, TableCustom } from "../../../../components/common"
import ShowToastMessage from "../../../../utils/toast"
import { ALERT_TYPE } from "../../../../consts/alertType"
import { useEntidad } from "../../../../components/hooks/useEntidad"
import AddFiltroModal from "./components/AddFiltroModal"
import { useMemo } from "react"

const Filtros = ({ idTipoTributo, params, data, setData, open, toggle, setPendingChange }) => {
    const [addingFiltro, setAddingFiltro] = useState(false)

    const [getEntidades, getRowEntidad, readyEntidad] = useEntidad({
        entidades: ['Filtro'],
        onLoaded: (entidades, isSuccess, error) => {
            if (isSuccess) {
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: {
          key: 'Filtro',
          timeout: 0
        }
    });

    const availableFiltros = useMemo(() => {
        if (!readyEntidad)
            return []
        else return getEntidades('Filtro').filter(x => (
            [idTipoTributo, 0, null].includes(x.idTipoTributo)
            && !data.some(y => x.id === y.idFiltro && y.state !== 'r')
        ))
    }, [data, readyEntidad])

    const tableData = useMemo(() => {
        if (!readyEntidad)
            return []
        else return data.filter(item => item.state !== 'r').map(item => ({
            id: item.id,
            nombre: getRowEntidad('Filtro', item.idFiltro).nombre,
            state: item.state,
        }))
    }, [data, readyEntidad])

    const onAdd = () => {
        setAddingFiltro(true)
    }

    const onRemove = ({ id }) => {
        console.log('removing id', id)
        const newData = [...data]
        for (let i = 0; i < newData.length; i++) {
            if (newData[i].id === id) {
                if (newData[i].state === 'o')
                    newData[i].state = 'r'
                else {
                    newData.splice(i, 1)
                }
                break
            }
        }
        setData(newData)
        setPendingChange(true)
    }

    const onAddConfirm = (selected) => {
        const newData = [...data]
        selected.forEach((item, index) => {
            let found = false
            for (let i = 0; i < newData.length; i++) {
                if (newData[i].idFiltro === item.id) {
                    newData[i].state = 'o'
                    found = true
                    break
                }
            }
            if (!found) newData.push({
                id: new Date() + index,
                idFiltro: item.id,
                idProcedimiento: parseInt(params.id),
                state: 'a',
            })
        })
        console.log('new', newData)
        setData(newData)
        setPendingChange(true)
        setAddingFiltro(false)
    }

    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon {...{open}} />
                        <h3 className={open ? 'active' : ''}>Filtros</h3>
                    </div>
                </div>
            </div>
        </div>
        {open &&
            <div className='accordion-body'>
                <TableCustom
                    className='TableCustomBase'
                    avmr={{ onAdd, onRemove, }}
                    data={tableData}
                    columns={[
                        { Header: 'Nombre', accessor: 'nombre', width: '95%', },
                    ]}
                    showPagination={false}
                    showFilterGlobal={false}
                    showDownloadCSV={false}
                />
            </div>
        }
        {addingFiltro && (
            <AddFiltroModal
                filtros={availableFiltros}  
                onConfirm={onAddConfirm}
                onCancel={() => setAddingFiltro(false)}
            />
        )}
    </>
}

export default Filtros
