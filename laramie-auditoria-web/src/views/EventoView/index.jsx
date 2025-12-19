import { useParams } from "react-router-dom"
import { DatePickerCustom, InputJson, InputToken, SectionHeading } from "../../components/common"
import { useEffect, useState } from "react"
import { useManagedContext, useNav } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { onRequestError, onRequestNoSuccess, onRequestProcessError } from "../../utils/requests"
import { LISTAS } from "../../consts/listas"

const EventoView = () => {
    const navigate = useNav()
    const params = useParams()
    const { setIsLoading } = useManagedContext()

    const [entity, setEntity] = useState({
        id: params.id,
        fecha: null,
        idModulo: 0,
        idTipoEvento: 0,
        idUsuario: 0,
        mensaje: '',
        origen: '',
        token: '',
        data: null,
    })

    const Search = (back = false, forward = false) => {
        setIsLoading(true)

        const urlParams = forward ? `/forward/${entity.id}` : back ? `/back/${entity.id}` : `/${entity.id}`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EVENTO,
            urlParams,
            null,
            res => {
                res.json().then(data => {
                    data.fecha = data.fecha ? new Date(data.fecha) : null
                    setEntity(data)
                    setIsLoading(false)
                }).catch(err => {
                    onRequestProcessError(err)
                    setIsLoading(false)
                })
            },
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }

    useEffect(Search, [params.id])

    const onClickBack = () => navigate({ to: Search(true, false) })
    const onClickForward = () => navigate({ to: Search(false, true) })

    const disabled = true

    return <>
        <SectionHeading
            titles={[
                { title: 'Eventos', url: '/eventos', },
                { title: `Código: ${entity.id}`, },
            ]}
        />
    
        <section className='section-accordion'>
            <div className='row form-basic'>
                <div className="col-12 col-md-4">
                    <label htmlFor="id" className="form-label">Código</label>
                    <input
                        type="number"
                        name="id"
                        className="form-control"
                        value={entity.id}
                        disabled={disabled}
                    />
                </div>
                <div className="col-12 col-md-8">
                    <label htmlFor="token" className="form-label">Token</label>
                    <InputToken
                        name="token"
                        value={entity.token}
                        disabled={disabled}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="idTipoEvento" className="form-label">Tipo de evento</label>
                    <select
                        name="idTipoEvento"
                        placeholder=""
                        className="form-control"
                        value={entity.idTipoEvento}
                        disabled={disabled}
                    >
                        {LISTAS.TIPO_EVENTO.getValues().map(item => (
                            <option value={item.id} key={item.id}>{item.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="idModulo" className="form-label">Módulo</label>
                    <select
                        name="idModulo"
                        placeholder=""
                        className="form-control"
                        value={entity.idTipoEvento}
                        disabled={disabled}
                    >
                        {LISTAS.MODULO.getValues().map(item => (
                            <option value={item.id} key={item.id}>{item.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="fecha" className="form-label">Fecha</label>
                    <DatePickerCustom
                        name="fecha"
                        className="form-control"
                        value={entity.fecha}
                        disabled={disabled}
                        time={true}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="usuario" className="form-label">Usuario/a</label>
                    <input
                        type="text"
                        name="usuario"
                        className="form-control"
                        value={entity.idUsuario}
                        disabled={disabled}
                    />
                </div>
                <div className="col-12 col-md-8">
                    <label htmlFor="mensaje" className="form-label">Mensaje</label>
                    <input
                        type="text"
                        name="mensaje"
                        className="form-control"
                        value={entity.mensaje}
                        disabled={disabled}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="mensaje" className="form-label">Origen</label>
                    <input
                        type="text"
                        name="mensaje"
                        className="form-control"
                        value={entity.origen}
                        disabled={disabled}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="data" className="form-label">Datos</label>
                    <InputJson
                        data={entity.data}
                    />
                </div>
            </div>

            <footer className='footer footer-action'>
                <div className='footer-action-container'>
                    <button className="btn back-button float-start" onClick={()=>window.close()}>Volver</button>
                    <button className="btn back-button m-left-5" onClick={onClickBack}>
                        <span className="material-symbols-outlined" title="Alerta Previa">chevron_left</span>
                    </button>
                    <button className="btn back-button m-left-5" onClick={onClickForward}>
                        <span className="material-symbols-outlined" title="Alerta Previa">chevron_right</span>
                    </button>
                </div>
            </footer>
        </section>
    </>
}

export default EventoView
