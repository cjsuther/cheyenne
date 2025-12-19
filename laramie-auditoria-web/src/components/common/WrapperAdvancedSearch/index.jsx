import { array, bool, func } from 'prop-types';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

import AdvancedSearch from "../AdvancedSearch"
import TabbedFilters from './TabbedFilters';
import UntabbedFilters from './UntabbedFilters';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';

const getDefaultValue = filter => {
    if (filter.valueIgnore) return filter.valueIgnore
    if (filter.type === 'string') return ''
    if (filter.type === 'boolean') return false
    if (filter.type === 'date') return null
    if (filter.type === 'select') return '0'
    
    return 0
}

const mapInitialFormValues = (filters) => filters.reduce((result, filter) => ({
    ...result,
    [filter.field]: { value: filter.presetValue ?? getDefaultValue(filter), label: filter.presetLabel ?? getDefaultValue(filter), } 
}), {})

const WrapperAdvancedSearch = forwardRef(({ filters, tabs, onSearch, requireFilter }, ref) => {
    const [selectedValues, setSelectedValues] = useState([])
    const [formValues, formSet] = useState(mapInitialFormValues(filters))

    const handleInput = (filter, value, label) => formSet({ ...formValues, [filter.field]: { value, label }})

    const tabRef = useRef()

    useImperativeHandle(ref, () => ({
        activeTab: tabRef.current?.activeTab,
        filters: Object.keys(filterMap).reduce((object, key) => ({
            ...object,
            [key]: selectedValues.find(x => x.field === key)?.value ?? getDefaultValue(filterMap[key])
        }), {})
    }), [selectedValues, formValues])

    const filterMap = useMemo(() => filters.reduce((result, filter) => ({ ...result, [filter.field]: filter }), [filters]))

    const labels = useMemo(() => selectedValues.map(({ field }) => ({
        title: filterMap[field]?.title,
        field,
        valueIgnore: getDefaultValue(filterMap[field]),
        value: formValues[field].label
    })), [selectedValues])

    const onTabChange = tab => {
        const newFormValues = {...formValues}
        
        Object.keys(newFormValues).forEach(key => {
            const filter = filterMap[key]

            if (tab.fields.includes(key)) {
                newFormValues[key] = {
                    value: filter.presetValue ?? getDefaultValue(filter),
                    label: filter.presetLabel ?? getDefaultValue(filter),
                }
            } else {
                newFormValues[key] = {
                    value: getDefaultValue(filter),
                    label: getDefaultValue(filter),
                }
            }
        })

        formSet(newFormValues)
    }
    
    const commitFilters = () => {
        let hasActiveFilters = false

        const values = []
        Object.keys(formValues).forEach(field => {
            const value = formValues[field].value
            
            if (value !== getDefaultValue(filterMap[field])) {
                hasActiveFilters = true
                values.push({ field, value })
            }
        })

        setSelectedValues(values)

        if (requireFilter && !hasActiveFilters) ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe introducir al menos un filtro')
        else setTimeout(() => onSearch(formValues), 1)
    }

    const onLabelRemoved = values => {
        const newFormValues = {...formValues}

        Object.keys(values).forEach(key => {
            if (values[key] === getDefaultValue(filterMap[key])) {
                newFormValues[key] = { value: values[key], label: values[key] }
            }
        })

        formSet(newFormValues)
    }

    return (
        <AdvancedSearch
            labels={labels}
            onSearch={commitFilters}
            formValues={formValues}
            formSet={onLabelRemoved}
        >
            {tabs ? (
                <TabbedFilters
                    {...{ tabs, onTabChange, formValues, handleInput }}
                    ref={tabRef}
                    filters={filterMap}
                    onEnter={commitFilters}
                />
            ) : (
                <UntabbedFilters
                    {...{filters, formValues, handleInput }}
                    onEnter={commitFilters}    
                />
            )}
        </AdvancedSearch>
    )
})

WrapperAdvancedSearch.propTypes = {
    filters: array.isRequired,
    tabs: array,
    onSearch: func.isRequired,
    requireFilter: bool,
}

export default WrapperAdvancedSearch
