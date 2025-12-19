import { useState } from 'react'
import { array, func } from 'prop-types';
import { AdvancedSearch } from '../'

const AutoFilters = (props) => {
    const onSearch = () => {
        props.onSearch(Object.keys(inputs).map(key => ({ field: key, value: inputs[key] })).filter(filter => filter.value !== ''))
        
        const newLabels = []
        props.schema.forEach(filter => {
            const input = inputs[filter.field]
            if (input !== '')
                newLabels.push({
                    title: filter.title,
                    value: filter.formatLabel ? filter.formatLabel(input) : input
                })
        })
        setLabels(newLabels)
    }

    const [inputs, setInputs] = useState(props.schema.reduce((obj, filter) => ({...obj, [filter.field]: '' }), {}))
    const [labels, setLabels] = useState([])

    const inputSection = props.schema.map(filter => (
        <div className="col-12 col-md-6 col-lg-4" key={filter.field}>
            <label htmlFor="codigo" className="form-label">{filter.title}</label>
            {filter.type === 'list' ? (
                <select className="form-control" name={filter.title} id={filter.field}
                    onChange={({ target: { value }}) => setInputs(prev => ({ ...prev, [filter.field]: value }))}
                >
                    <option value=''></option>
                    {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    name="codigo"
                    type="text"
                    placeholder=""
                    className="form-control"
                    value={inputs[filter.field]}
                    onChange={({ target: { value } }) => setInputs(prev => ({ ...prev, [filter.field]: value }))}
                />
            )}
        </div>
    ))

    return (
        <AdvancedSearch {...{labels, onSearch}} >
            <div className='row form-basic'>
                {inputSection}
            </div>
        </AdvancedSearch>
    )
}

AutoFilters.propTypes = {
    onSearch: func.isRequired,
    schema: array.isRequired,
}

export default AutoFilters
