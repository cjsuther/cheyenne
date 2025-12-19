import { getDateToString } from "../../../utils/convert"
import DatePickerCustom from "../DatePickerCustom"
import InputEntidad from "../InputEntidad"
import InputLista from "../InputLista"
import InputPersona from "../InputPersona"
import InputSubTasa from "../InputSubTasa"
import InputTasa from "../InputTasa"
import InputWithEnterEvent from "../InputWithEnterEvent"

const InputFilter = ({ filter, formValues, handleInput, onEnter, disabled }) => {
    const getDefaultFilterProps = (filter) => ({
        name: filter.field,
        className: "form-control",
        placeholder: "",
        value: formValues[filter.field]?.value,
        disabled: disabled,
    })

    const buildInputBoolean = (filter) => (
        <InputWithEnterEvent
            {...getDefaultFilterProps(filter)}
            className="form-check-input"
            type="checkbox"
            onChange={({ target }) => handleInput(filter, target.checked, target.checked ? 'Sí' : 'No')}
        />
    )

    const buildInputDate = (filter) => (
        <DatePickerCustom
            {...getDefaultFilterProps(filter)}
            onChange={({ target }) => handleInput(filter, target.value, getDateToString(target.value))}
            minValue={formValues[filter.minValueField]?.value}
        />
    )

    const buildInputTasa = (filter) => (
        <InputTasa
            {...getDefaultFilterProps(filter)}
            onChange={({ target }) => handleInput(filter, target.value, target.row?.descripcion ?? '')}
        />
    )

    const buildInputSubTasa = (filter) => (
        <InputSubTasa
            {...getDefaultFilterProps(filter)}
            onChange={({ target }) => handleInput(filter, target.value, target.row?.descripcion ?? '')}
            idTasa={formValues[filter.fieldTasa]?.value}
        />
    )

    const buildInputLista = (filter) => (
        <InputLista
            {...getDefaultFilterProps(filter)}
            onChange={({ target }) => handleInput(filter, target.value, target.row?.nombre)}
            lista={filter.lista}
        />
    )

    const buildInputEntidad = (filter) => (
        <InputEntidad
            {...getDefaultFilterProps(filter)}
            onChange={({ target }) => handleInput(filter, target.value, target.row?.nombre)}
            entidad={filter.entidad}
        />
    )

    const buildInputPersona = (filter) => (
        <InputPersona
            {...getDefaultFilterProps(filter)}
            onChange={({ target }) => handleInput(filter, target.value, target.row?.nombrePersona)}
            idTipoPersona={filter.idTipoPersona ?? 0}
        />
    )

    const buildInputSelect = (filter) => (
        <select
            {...getDefaultFilterProps(filter)}
            onChange={({ target }) => handleInput(filter, target.value, filter.options.find(item => item.value === target.value)?.title??'')}
        >
            {filter.options.map(({ value, title }) =>
                <option value={value} key={value}>{title}</option>
            )}
        </select>
    )

    const buildInputCustom = (filter) => (
        <InputWithEnterEvent
            {...getDefaultFilterProps(filter)}
            onChange={({ target }) => handleInput(filter, target.value, target.value)}
            type={filter.type}
            onEnter={filter.searchOnEnter ? onEnter : () => {}}
            mask={filter.mask}
            useInputFormat={filter.mask !== undefined}
            autoComplete={filter.autoComplete}
        />
    )

    const mapFilter = (filter) => {
        if (filter.type === 'boolean') return buildInputBoolean(filter)
        if (filter.type === 'date') return buildInputDate(filter)
        if (filter.type === 'tasa') return buildInputTasa(filter)
        if (filter.type === 'subtasa') return buildInputSubTasa(filter)
        if (filter.type === 'list') return buildInputLista(filter)
        if (filter.type === 'entity') return buildInputEntidad(filter)
        if (filter.type === 'persona') return buildInputPersona(filter)
        if (filter.type === 'select') return buildInputSelect(filter)
        
        return buildInputCustom(filter)
    }

    return (
        <div className={`col-12 col-md-${filter.size}` + (filter.type === 'boolean' ? ' form-check' : '')}>
            <label htmlFor={filter.field} className="form-label">{filter.title}</label>
            {mapFilter(filter)}
        </div>
    )
}

export default InputFilter
