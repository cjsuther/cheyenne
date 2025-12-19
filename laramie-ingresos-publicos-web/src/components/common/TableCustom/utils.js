export const buildCheckColumn = (props, selectedAll, setSelectedAll) => ({
    accessor: 'selected', width:'5%', disableGlobalFilter: true, disableSortBy: true,
    Header: (cell) => (
        <div className='action-check'>
            <input
                type="checkbox"
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
            <input type="checkbox" checked={cell.value}
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

export const buildAvmrColumn = ({ onAdd, onView, onModify, onRemove, onAdditionalInfo }) => ({
    id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true,
    Header: () => onAdd ? (
        <div className='action'>
            <div onClick={onAdd} className="link">
                <i className="fa fa-plus" title="nuevo"></i>
            </div>
        </div>
    ) : '',
    Cell: ({ row }) =>  (
        <div className='action'>
            {onView && <div onClick={() => onView(row.original)} className="link">
                <i className="fa fa-search" title="ver"></i>
            </div>}
            {onModify && <div onClick={() => onModify(row.original)} className="link">
                <i className="fa fa-pen" title="modificar"></i>
            </div>}
            {onRemove && <div onClick={() => onRemove(row.original)} className="link">
                <i className="fa fa-trash" title="borrar"></i>
            </div>}
            {onAdditionalInfo && <div onClick={() => onAdditionalInfo(row.original)} className="link">
                <i className="fa fa-info-circle" title="Información adicional"></i>
            </div>}
        </div>
    ),
})

