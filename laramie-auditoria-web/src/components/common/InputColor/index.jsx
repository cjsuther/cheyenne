import { bool, string, func } from 'prop-types';

const InputColor = (props) => {
    const onChange = (e) => {
        const { value, selectionStart, selectionEnd } = e.target

        let final = ''

        for (let i = 0; i < value.length; i++) {
            if (final.length >= 6) break

            const char = value.charAt(i).toUpperCase()

            if (/^[0-9A-Fa-f]/.test(char)) final += char
        }

        e.target.value = final
        e.target.selectionStart = selectionStart
        e.target.selectionEnd = selectionEnd

        props.onChange(e)
    }

    return (
        <input
            type="text"
            name={props.name}
            className="form-control"
            placeholder={props.placeholder}
            value={props.value}
            onChange={onChange}
            disabled={props.disabled}
        />
    )
}

InputColor.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: string,
    onChange: func,
    disabled: bool
};

export default InputColor
