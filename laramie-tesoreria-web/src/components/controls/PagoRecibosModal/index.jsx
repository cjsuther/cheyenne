import { useEffect, useMemo, useState } from "react"
import { ALERT_TYPE } from "../../../consts/alertType"
import { MEDIO_PAGO } from "../../../consts/medioPago"
import ShowToastMessage from "../../../utils/toast"
import { isValidNumber, isValidString } from "../../../utils/validator"
import { InputLista, InputNumber, Modal } from "../../common"
import { useForm, useLista } from "../../hooks"
import { getDateId, getDateNow, precisionRound } from "../../../utils/convert"


const cobranzaInit = {
    importeRecibos: 0,
    importeMediosPagos: 0,
    importeCobro: 0,
    idMedioPago: 0,
    importeIngresado: 0,
    numeroMedioPago: "",
    bancoMedioPago: "",
    emisorMedioPago: ""
}

const PagoRecibosModal = ({ recibos, mediosPagos, onCancel, onConfirm }) => {
    const [bancos, setBancos] = useState([]);
    const [emisores, setEmisores] = useState([]);
    const [formValues, formHandle, , formSet] = useForm(cobranzaInit)

    useEffect(() => {
        const fechaCobro = getDateNow(false);
        let importeRecibos = 0;
        for(let r=0; r<recibos.length; r++) {
            const recibo = recibos[r];
            let importeVencimiento = 0;
            if (fechaCobro.getTime() <= recibo.fechaVencimiento1.getTime()) {
                importeVencimiento = recibo.importeVencimiento1;
            }
            else if (fechaCobro.getTime() <= recibo.fechaVencimiento2.getTime()) {
                importeVencimiento = recibo.importeVencimiento2;
            }
            importeRecibos += importeVencimiento;
        }
        let importeMediosPagos = 0;
        for(let mp=0; mp<mediosPagos.length; mp++) {
            const medioPago = mediosPagos[mp];
            importeMediosPagos += medioPago.importeCobro;
        }
        const importeCobro = precisionRound(importeRecibos - importeMediosPagos);

        formSet({...cobranzaInit,
            importeRecibos: importeRecibos,
            importeMediosPagos: importeMediosPagos,
            importeCobro: importeCobro,
            importeIngresado: 0
        })
    }, [recibos, mediosPagos])

    useEffect(() => {
        if (formValues.idMedioPago??0 > 0) {
            formSet({...formValues,
                importeIngresado: (formValues.idMedioPago === MEDIO_PAGO.EFECTIVO) ? 0 : formValues.importeCobro
            })
        }
    }, [formValues.idMedioPago])

    const importeVuelto = useMemo(() => {
        return (formValues.importeIngresado > formValues.importeCobro) ? precisionRound(formValues.importeIngresado - formValues.importeCobro) : 0
    }, [formValues.importeIngresado, formValues.importeCobro])

    const [getListLista, ] = useLista({
        listas: ['Banco','Emisor'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            setBancos(getListLista('Banco'));
            setEmisores(getListLista('Emisor'));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'Banco_Emisor',
          timeout: 0
        }
    });

    const AplicarPagoRecibos = () => {
        const medioPago = {
            id: (-1)*getDateId(),
            idMedioPago: formValues.idMedioPago,
            numeroMedioPago: formValues.numeroMedioPago,
            bancoMedioPago: (formValues.idMedioPago === MEDIO_PAGO.CHEQUE) ? formValues.bancoMedioPago : 
                            ([MEDIO_PAGO.TARJETA_CREDITO, MEDIO_PAGO.TARJETA_DEBITO].includes(formValues.idMedioPago)) ? formValues.emisorMedioPago : "",
            importeCobro: (formValues.importeCobro > formValues.importeIngresado) ? formValues.importeIngresado : formValues.importeCobro
        }
        onConfirm(medioPago);
    }

    const onClickConfirm = () => {

        if (!isValidNumber(formValues.idMedioPago, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el medio de pago')
        if (!isValidNumber(formValues.importeIngresado, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el importe')

        if ([MEDIO_PAGO.TARJETA_CREDITO,MEDIO_PAGO.TARJETA_DEBITO].includes(formValues.idMedioPago)) {
            if (!isValidString(formValues.numeroMedioPago, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el número')
            if (!isValidString(formValues.emisorMedioPago, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el emisor')
        }
        if (formValues.idMedioPago === MEDIO_PAGO.CHEQUE) {
            if (!isValidString(formValues.numeroMedioPago, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el número')
            if (!isValidString(formValues.bancoMedioPago, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el banco')
        }

        AplicarPagoRecibos()
    }

    return (
        <Modal
            size="md"
            title="Pago de recibos"
            body={(
                <>
                <div className='row form-basic'>
                    <div className="col-12 col-lg-6">
                        <label htmlFor="importeCobro" className="form-label">Total a pagar</label>
                        <InputNumber
                            precision={2}
                            name="importeCobro"
                            placeholder=""
                            className="form-control"
                            value={formValues.importeCobro}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className='row form-basic'>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idMedioPago" className="form-label">Medio de pago</label>
                        <InputLista
                            name="idMedioPago"
                            placeholder=""
                            className="form-control"
                            value={formValues.idMedioPago}
                            onChange={formHandle}
                            lista="MedioPago"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <label htmlFor="importeIngresado" className="form-label">Monto ingresado</label>
                        <InputNumber
                            precision={2}
                            name="importeIngresado"
                            placeholder=""
                            className="form-control"
                            value={formValues.importeIngresado}
                            onChange={formHandle}
                        />
                    </div>
                </div>
                <div className='row form-basic'>
                    {formValues.idMedioPago === MEDIO_PAGO.EFECTIVO &&
                    <div className="col-12 col-lg-6">
                        <label htmlFor="importeVuelto" className="form-label">Vuelto</label>
                        <InputNumber
                            precision={2}
                            name="importeVuelto"
                            placeholder=""
                            className="form-control"
                            value={importeVuelto}
                            disabled={true}
                        />
                    </div>
                    }
                    {[MEDIO_PAGO.CHEQUE,MEDIO_PAGO.TARJETA_CREDITO,MEDIO_PAGO.TARJETA_DEBITO].includes(formValues.idMedioPago) &&
                    <div className="col-12 col-lg-6">
                        <label htmlFor="numeroMedioPago" className="form-label">{formValues.idMedioPago === MEDIO_PAGO.CHEQUE ? "Número cheque" : "Número control"}</label>
                        <input
                            type="text"
                            name="numeroMedioPago"
                            placeholder=""
                            className="form-control"
                            value={formValues.numeroMedioPago}
                            onChange={formHandle}
                            maxLength={50}
                        />
                    </div>
                    }
                    {[MEDIO_PAGO.TARJETA_CREDITO,MEDIO_PAGO.TARJETA_DEBITO].includes(formValues.idMedioPago) &&
                    <div className="col-12 col-lg-6">
                        <label htmlFor="emisorMedioPago" className="form-label">Emisor</label>
                        <select
                            name="emisorMedioPago"
                            className="form-control"
                            value={ formValues.emisorMedioPago }
                            onChange={({target}) =>{
                                formSet({...formValues, emisorMedioPago: target.value});
                            }}
                        >
                        <option value=""></option>
                        {emisores.map(emisor =>
                          <option value={emisor.nombre} key={emisor.id}>{emisor.nombre}</option>
                        )}
                        </select>
                    </div>
                    }
                    {formValues.idMedioPago === MEDIO_PAGO.CHEQUE &&
                    <div className="col-12 col-lg-6">
                        <label htmlFor="bancoMedioPago" className="form-label">Banco</label>
                        <select
                            name="bancoMedioPago"
                            className="form-control"
                            value={ formValues.bancoMedioPago }
                            onChange={({target}) =>{
                                formSet({...formValues, bancoMedioPago: target.value});
                            }}
                        >
                        <option value=""></option>
                        {bancos.map(banco =>
                          <option value={banco.nombre} key={banco.id}>{banco.nombre}</option>
                        )}
                        </select>
                    </div>
                    }
                </div>
                </>
            )}
            footer={(
                <div className="width-100p disp-b">
                    <button className="btn back-button m-left-5" data-dismiss="modal" onClick={onCancel}>Volver</button>
                    <button className="btn action-button" data-dismiss="modal" onClick={onClickConfirm}>Pagar</button>
                </div>
            )}
        />
    )
}

export default PagoRecibosModal
