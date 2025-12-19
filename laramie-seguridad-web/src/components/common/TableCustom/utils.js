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
