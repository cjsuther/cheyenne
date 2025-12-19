import { array, bool, func } from 'prop-types';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

import AdvancedSearch from '../AdvancedSearch';
import TabbedFilters from './TabbedFilters';
import UntabbedFilters from './UntabbedFilters';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';

const getDefaultValue = (filter) => {
    if (filter.valueIgnore) return filter.valueIgnore;
    if (filter.type === 'string') return '';
    if (filter.type === 'boolean') return false;
    if (filter.type === 'date') return null;
    if (filter.type === 'ejercicio') return '';
    if (filter.type === 'number') return 0;
    return 0;
};

const mapInitialFormValues = (filters) =>
    filters.reduce((result, filter) => ({
        ...result,
        [filter.field]: {
            value: filter.presetValue ?? getDefaultValue(filter),
            label: filter.presetLabel ?? getDefaultValue(filter),
        },
    }), {});

const WrapperAdvancedSearch = forwardRef(({ filters, tabs, onSearch, requireFilter }, ref) => {
    const [selectedValues, setSelectedValues] = useState([]);
    const [formValues, formSet] = useState(mapInitialFormValues(filters));
    const [activeTabKey, setActiveTabKey] = useState(tabs?.[0]?.key || '');

    const handleInput = (filter, value, label) =>
        formSet({ ...formValues, [filter.field]: { value, label } });

    const filterMap = useMemo(() => filters.reduce((result, filter) => ({
        ...result,
        [filter.field]: filter
    }), {}), [filters]);

    useImperativeHandle(ref, () => ({
        activeTab: activeTabKey,
        filters: Object.keys(filterMap).reduce((object, key) => ({
            ...object,
            [key]: selectedValues.find(x => x.field === key)?.value ?? getDefaultValue(filterMap[key])
        }), {})
    }), [selectedValues, formValues, filterMap, activeTabKey]);

    const labels = useMemo(() => selectedValues.map(({ field, label }) => ({
        title: filterMap[field]?.title,
        field,
        valueIgnore: getDefaultValue(filterMap[field]),
        value: label
    })), [selectedValues, filterMap]);

    const onTabChange = (tab) => {
        setActiveTabKey(tab.key);

        const newFormValues = { ...formValues };

        tab.fields.forEach((field) => {
            const filter = filterMap[field];
            newFormValues[field] = {
                value: filter.presetValue ?? getDefaultValue(filter),
                label: filter.presetLabel ?? getDefaultValue(filter),
            };
        });

        formSet(newFormValues);
    };

    const commitFilters = () => {
        let hasActiveFilters = false;
        let values = [];

        Object.keys(formValues).forEach((field) => {
            const value = formValues[field].value;
            if (value !== getDefaultValue(filterMap[field])) {
                hasActiveFilters = true;
                const label = formValues[field].label;
                values.push({ field, value, label });
            }
        });

        if (tabs && tabs.length > 0) {
            const activeTab = tabs.find(tab => tab.key === activeTabKey);
            if (activeTab) {
                values = values.filter(v => activeTab.fields.includes(v.field));
            }
        }

        setSelectedValues(values);

        if (requireFilter && !hasActiveFilters) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe introducir al menos un filtro');
        } else {
            setTimeout(() => onSearch(formValues), 1);
        }
    };

    const onLabelRemoved = (values) => {
        const newFormValues = { ...formValues };

        Object.keys(values).forEach((key) => {
            if (values[key] === getDefaultValue(filterMap[key])) {
                newFormValues[key] = { value: values[key], label: values[key] };
            }
        });

        formSet(newFormValues);
    };

    const hasTabs = tabs && tabs.length > 0;

    return (
        <AdvancedSearch
            labels={labels}
            onSearch={commitFilters}
            formValues={formValues}
            formSet={onLabelRemoved}
        >
            {hasTabs ? (
                <TabbedFilters
                    {...{ tabs, onTabChange, formValues, handleInput }}
                    filters={filterMap}
                    onEnter={commitFilters}
                />
            ) : (
                <UntabbedFilters
                    {...{ filters, formValues, handleInput }}
                    onEnter={commitFilters}
                />
            )}
        </AdvancedSearch>
    );
});

WrapperAdvancedSearch.propTypes = {
    filters: array.isRequired,
    tabs: array,
    onSearch: func.isRequired,
    requireFilter: bool,
};

export default WrapperAdvancedSearch;
