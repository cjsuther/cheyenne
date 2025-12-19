import InputFilter from "./InputFilter"

const UntabbedFilters = ({ filters, formValues, handleInput, onEnter, disabled }) => {
    return (
        <div className="row form-basic">
            {filters.map(filter => (
                <InputFilter {...{filter, formValues, handleInput, onEnter, disabled }} key={filter.field} />
            ))}
        </div>
    )
}

export default UntabbedFilters
