export const buildCheckColumn = (props, selectedAll, setSelectedAll) => ({
    accessor: 'selected', width:'5%', disableGlobalFilter: true, disableSortBy: true,
    Header: (cell) => (
        <div className='action-check'>
            <input
                type="checkbox"
                className="form-check-input"
                checked={selectedAll}
                onChange={() => {
                    props.onItemsSelected(cell.page.map(x => ({id: x.original.id, selected: !selectedAll && props.selectionAllowed(x.original)})))
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
                disabled={!props.selectionAllowed(cell.row.original)}
            />
        </div>
    ),
})

export const buildAvmrColumn = ({ onAdd, onView, onModify, onClone, onRemove, onDownload, onAdditionalInfo, canEditRow, customActions = [], customActionsPosition = 'after' }, canEdit) => ({
    id:'abm', accessor: 'id', width: '4%', disableGlobalFilter: true, disableSortBy: true,
    Header: () => (onAdd && canEdit) ? (
        <div className='action'>
            <div onClick={onAdd} className="link">
                <span className="material-symbols-outlined" title="Nuevo">add</span>
            </div>
        </div>
    ) : '',
    Cell: ({ row }) =>  {
        const renderCustomActions = () => customActions.map((action, index) => {
            const { icon, title, onClick, requiresEdit = false, show } = action;

            if (show && !show(row.original)) {
                return null;
            }

            if (requiresEdit && (!canEdit || (canEditRow && !canEditRow(row.original)))) {
                return null;
            }

            return (
                <div key={index} onClick={() => onClick(row.original)} className="link">
                    <span className="material-symbols-outlined" title={title}>{icon}</span>
                </div>
            );
        });

        return (
            <div className='action'>
                {customActionsPosition === 'before' && renderCustomActions()}
                {onView && <div onClick={() => onView(row.original)} className="link">
                    <span className="material-symbols-outlined" title="Ver">search</span>
                </div>}
                {canEdit && onModify && (!canEditRow || canEditRow(row.original)) && <div onClick={() => onModify(row.original)} className="link">
                    <span className="material-symbols-outlined" title="Modificar">stylus</span>
                </div>}
                {canEdit && onClone && (!canEditRow || canEditRow(row.original)) && <div onClick={() => onClone(row.original)} className="link">
                    <span className="material-symbols-outlined" title="Clonar">content_copy</span>
                </div>}
                {canEdit && onRemove && (!canEditRow || canEditRow(row.original)) && <div onClick={() => onRemove(row.original)} className="link">
                    <span className="material-symbols-outlined" title="Eliminar">delete</span>
                </div>}
                {onDownload && <div onClick={() => onDownload(row.original)} className="link">
                    <span className="material-symbols-outlined" title="Descargar CSV">download</span>
                </div>}
                {onAdditionalInfo && <div onClick={() => onAdditionalInfo(row.original, !canEdit)} className="link">
                    <span className="material-symbols-outlined" title="Información adicional">info</span>
                </div>}
                {customActionsPosition === 'after' && renderCustomActions()}
            </div>
        );
    },
})
