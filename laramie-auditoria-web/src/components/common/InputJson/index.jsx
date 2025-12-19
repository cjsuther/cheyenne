import ReactJson from 'react-json-view'

const InputJson = ({ data }) => {
    return (
        <ReactJson
            src={data ?? {}}
            collapsed={1}
            className="form-control"
            style={{ overflowWrap: 'anywhere' }}
        />
    )
}

export default InputJson
