export const buildCheckColumn = (props, selectedAll, setSelectedAll) => ({
    accessor: 'selected', width:'5%', disableGlobalFilter: true, disableSortBy: true,
    Header: (cell) => (
        <div className='action-check'>
            <input
                type="checkbox"
                className="form-check-input"
                checked={selectedAll}
                onChange={() => {
                    props.onItemsSelected(cell.page.map(x => ({id: x.original.id, selected: !selectedAll})))
                    setSelectedAll(!selectedAll)
                }}
            />
        </div>
    ),
    Cell: (cell) => (
        <div className='action-check'>
            <input 
                type="checkbox"
                className="form-check-input" 
                checked={cell.value}
                onChange={() => {
                    const item = cell.row.original
                    if (item.selected)
                        setSelectedAll(false)
                    props.onItemsSelected([{ id: item.id, selected: !item.selected }])
                }}
            />
        </div>
    ),
})

export const buildAvmrColumn = ({ onAdd, onView, onModify, onClone, onRemove, onDownload, onAdditionalInfo }, canEdit) => ({
    id:'abm', accessor: 'id', width: '4%', disableGlobalFilter: true, disableSortBy: true,
    Header: () => (onAdd && canEdit) ? (
        <div className='action'>
            <div onClick={onAdd} className="link">
                <span className="material-symbols-outlined" title="Nuevo">add</span>
            </div>
        </div>
    ) : '',
    Cell: ({ row }) =>  (
        <div className='action'>
            {onView && <div onClick={() => onView(row.original)} className="link">
                <span className="material-symbols-outlined" title="Ver">search</span>
            </div>}
            {canEdit && onModify && <div onClick={() => onModify(row.original)} className="link">
                <span className="material-symbols-outlined" title="Modificar">stylus</span>
            </div>}
            {canEdit && onClone && <div onClick={() => onClone(row.original)} className="link">
                <span className="material-symbols-outlined" title="Clonar">content_copy</span>
            </div>}
            {canEdit && onRemove && <div onClick={() => onRemove(row.original)} className="link">
                <span className="material-symbols-outlined" title="Eliminar">delete</span>
            </div>}
            {onDownload && <div onClick={() => onDownload(row.original)} className="link">
                <span className="material-symbols-outlined" title="Descargar CSV">download</span>
            </div>}
            {onAdditionalInfo && <div onClick={() => onAdditionalInfo(row.original, !canEdit)} className="link">
                <span className="material-symbols-outlined" title="Información adicional">info</span>
            </div>}
        </div>
    ),
})

