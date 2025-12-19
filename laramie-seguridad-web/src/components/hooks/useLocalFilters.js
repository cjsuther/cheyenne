import { useMemo, useRef, useState, } from 'react'

export const useLocalFilters = (data) => {
    const tableRef = useRef(null)

    const passesFilters = (item, filters) => filters.every(filter => String(item[filter.field]).toLowerCase().includes(filter.value.toLowerCase()))

    const [filters, _setFilters] = useState([])
    const setFilters = (filters) => {
        tableRef.current?.manualReset()
        _setFilters(filters)
    } 
    const filteredData = useMemo(
        () => data.filter(x => passesFilters(x, filters)),
        [data, filters]
    )

    return [filteredData, setFilters, tableRef]
}
