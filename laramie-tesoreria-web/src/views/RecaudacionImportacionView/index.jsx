import { useState } from "react"
import { useForm, useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { DatePickerCustom, InputEntidad, InputNumber, SectionHeading, TableCustom } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import InputFile from "../../components/common/InputFile"
import { getDateToString, getFormatNumber } from "../../utils/convert"


const importacionInit = {
    idRecaudadora: 0,
    codigoCliente: '',
    fechaRecaudacion: null,
    Archivo_nombre: '',
    Archivo_path: ''
}
const cabeceraInit = {
    Archivo_nombre: '',
    fechaLote: null,
    casos: 0,
    importeTotal: 0
}

const RecaudacionImportacionView = () => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const [recibos, setRecibos] = useState([])
    const [showImportacion, setShowImportacion] = useState(true)
    const [importacion_formValues, importacion_formHandle, importacion_formReset, importacion_formSet ] = useForm(importacionInit, 'importacion_')
    const [formValues, , formReset, formSet ] = useForm(cabeceraInit)
    const [idMetodoImportacion, setIdMetodoImportacion] = useState(0)

    const ImportarRecaudacionAPI = () => {
        setIsLoading(true)

        const dataBody = {
            fechaEnvio: (idMetodoImportacion === 41) ? importacion_formValues.fechaRecaudacion : null
        }

        const paramsUrl = `/${importacion_formValues.codigoCliente}`

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.IMPORTADOR,
            paramsUrl,
            dataBody,
            res => res.json().then(data => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Importación exitosa')
                setIsLoading(false)
            }),
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

    const ImportarRecaudacion = () => {
        setIsLoading(true)

        const dataBody = {
            idRecaudadora: importacion_formValues.idRecaudadora,
            nombre: (idMetodoImportacion === 40) ? importacion_formValues.Archivo_nombre : '',
            path: (idMetodoImportacion === 40) ? importacion_formValues.Archivo_path : ''
        }

        const paramsUrl = `/importacion/preview`

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            paramsUrl,
            dataBody,
            res => res.json().then(data => {
                if (data.recaudacionLote.fechaLote) data.recaudacionLote.fechaLote = new Date(data.recaudacionLote.fechaLote);
                setShowImportacion(false)
                setRecibos(data.recaudaciones)
                formSet({
                    Archivo_nombre: data.nombre,
                    fechaLote: data.recaudacionLote.fechaLote,
                    casos: data.recaudacionLote.casos,
                    importeTotal: data.recaudacionLote.importeTotal
                })
                setIsLoading(false)
            }),
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
    const ConfirmarRecaudacion = () => {
        setIsLoading(true)

        const dataBody = {
            idRecaudadora: importacion_formValues.idRecaudadora,
            nombre: (idMetodoImportacion === 40) ? importacion_formValues.Archivo_nombre : '',
            path: (idMetodoImportacion === 40) ? importacion_formValues.Archivo_path : ''
        }

        const paramsUrl = `/importacion/confirmacion`

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            paramsUrl,
            dataBody,
            res => res.json().then(data => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Importación exitosa')
                setRecibos([])
                formReset(cabeceraInit)
                importacion_formReset()
                setShowImportacion(true)
                setIsLoading(false)
            }),
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
    
    const handleImportar = () => {
        if (importacion_formValues.idRecaudadora === 0) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar una recaudadora')
        if (idMetodoImportacion === 40 && importacion_formValues.Archivo_nombre.length === 0) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el Archivo')
        if (idMetodoImportacion === 41 && !importacion_formValues.fechaRecaudacion) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar la fecha')

        if (idMetodoImportacion === 40) ImportarRecaudacion()
        if (idMetodoImportacion === 41) ImportarRecaudacionAPI()
    }
    const handleConfirmar = () => {
        showMessageModal({
            title: "Confirmación",
            message: "¿Está seguro/a de confirmar?",
            onConfirm: () => ConfirmarRecaudacion(),
        })
    }
    const handleCancelar = () => {
        setRecibos([])
        formReset(cabeceraInit)
        importacion_formReset()
        setShowImportacion(true)
    }
    const handleUploadArchivo = (filename, data) => {

        const callbackSuccess = (response) => {
            response.text()
            .then((path) => {
                importacion_formSet({...importacion_formValues,
                    Archivo_path: path,
                    Archivo_nombre: filename
                });
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            });
        };
    
        const paramsHeaders = {
            "Content-Type": "application/octet-stream"
        };
        ServerRequest(
            REQUEST_METHOD.POST,
            paramsHeaders,
            true,
            APIS.URLS.FILE,
            null,
            data,
            callbackSuccess,
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
            false
        );   
    }

    return <>
        <SectionHeading titles={[{ title: 'Recaudaciones' }, { title: 'Importación de recaudaciones' }]} />

        {(showImportacion &&
        <section className='section-accordion'>
            <div className="m-top-20">
                <div className="row form-basic">
                    <div className="col-12 col-md-4">
                        <label htmlFor="importacion_idRecaudadora" className="form-label">Recaudadora</label>
                        <InputEntidad
                            name="importacion_idRecaudadora"
                            placeholder=""
                            className="form-control"
                            value={importacion_formValues.idRecaudadora}
                            onChange={({target}) => {
                                if (target.row) {
                                    const idRecaudadora = target.row.id;
                                    importacion_formSet({...importacion_formValues,
                                        idRecaudadora: idRecaudadora,
                                        codigoCliente: target.row.codigoCliente,
                                        fechaRecaudacion: null,
                                        Archivo_nombre: '',
                                        Archivo_path: ''
                                    });
                                    setIdMetodoImportacion(target.row.idMetodoImportacion);
                                }
                                else {
                                    importacion_formSet({...importacion_formValues,
                                        idRecaudadora: 0,
                                        codigoCliente: '',
                                        fechaRecaudacion: null,
                                        Archivo_nombre: '',
                                        Archivo_path: ''
                                    });
                                    setIdMetodoImportacion(0);
                                }
                            }}
                            entidad="Recaudadora"
                            filter={row => [40,41].includes(row.idMetodoImportacion)}
                        />
                    </div>
                    {idMetodoImportacion === 40 &&
                    <div className="col-12 col-md-6">
                        <label htmlFor="importacion_Archivo_nombre" className="form-label">Archivo</label>
                        <InputFile
                            name="importacion_Archivo_nombre"
                            type="text"
                            placeholder="Click para adjuntar un archivo..."
                            className="form-control"
                            value={ importacion_formValues.Archivo_nombre }
                            onUpload={ handleUploadArchivo }
                        />
                    </div>
                    }
                    {idMetodoImportacion === 41 &&
                    <div className="col-12 col-md-2">
                        <label htmlFor="importacion_fechaRecaudacion" className="form-label">Fecha</label>
                        <DatePickerCustom
                            name="importacion_fechaRecaudacion"
                            placeholder=""
                            className="form-control"
                            value={importacion_formValues.fechaRecaudacion}
                            onChange={importacion_formHandle}
                        />
                    </div>
                    }
                    {idMetodoImportacion === 42 &&
                    <div className="col-12 col-md-2 m-top-40">
                        <label htmlFor="" className="form-label">No aplica importación</label>
                    </div>
                    }
                </div>
            </div>
        </section>
        )}

        {(recibos.length > 0 &&
        <section className='section-accordion'>

            <div className="row form-basic">
                <div className="col-6 col-lg-3">
                    <label htmlFor="Archivo_nombre" className="form-label">Archivo</label>
                    <input
                        name="Archivo_nombre"
                        placeholder=""
                        className="form-control"
                        value={formValues.Archivo_nombre}
                        disabled={true}
                    />
                </div>
                <div className="col-6 col-lg-3">
                    <label htmlFor="fechaLote" className="form-label">Fecha lote</label>
                    <DatePickerCustom
                        name="fechaLote"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaLote }
                        disabled={true}
                    />
                </div>
                <div className="col-6 col-lg-3">
                    <label htmlFor="casos" className="form-label">Casos</label>
                    <InputNumber
                        precision={0}
                        name="casos"
                        placeholder=""
                        className="form-control"
                        value={formValues.casos}
                        disabled={true}
                    />
                </div>
                <div className="col-6 col-lg-3">
                    <label htmlFor="importeTotal" className="form-label">Importe total</label>
                    <InputNumber
                        precision={2}
                        name="importeTotal"
                        placeholder=""
                        className="form-control"
                        value={formValues.importeTotal}
                        disabled={true}
                    />
                </div>

            </div>

            <TableCustom
                className={'TableCustomBase m-top-20'}
                data={recibos}
                columns={[
                    { Header: 'N° cliente', accessor: 'numeroCuenta', width: '25%' },
                    { Header: 'Identificador recibo', accessor: 'codigoBarras', width: '35%' },
                    { Header: 'Fecha de cobro', accessor: 'fechaCobro', Cell: (data) => getDateToString(data.value), width: '20%' },
                    { Header: 'Importe ($)', accessor: 'importeCobro', Cell: (data) => getFormatNumber(data.value, 2), width: '20%', alignCell: 'right' },
                ]}
                showDownloadCSV={false}
                showFilterGlobal={false}
            />

        </section>
        )}

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                {showImportacion && [40,41].includes(idMetodoImportacion) &&
                <>
                    <button className="btn action-button float-end" onClick={ (event) => handleImportar() }>Importar</button>
                </>
                }
                {recibos.length > 0 &&
                <>
                    <button className="btn action-button float-end m-left-5" onClick={ (event) => handleConfirmar() }>Confirmar</button>
                    <button className="btn btn-outline-primary float-end" onClick={ (event) => handleCancelar() }>Cancelar</button>
                </>
                }
            </div>
        </footer>

    </>
}

export default RecaudacionImportacionView
