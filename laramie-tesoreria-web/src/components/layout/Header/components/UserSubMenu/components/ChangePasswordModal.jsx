import { APPCONFIG } from "../../../../../../app.config"
import { APIS } from "../../../../../../config/apis"
import { ALERT_TYPE } from "../../../../../../consts/alertType"
import encrypt from "../../../../../../utils/encrypt"
import { standardRequest } from "../../../../../../utils/requests"
import ShowToastMessage from "../../../../../../utils/toast"
import { validatePassword } from "../../../../../../utils/validator"
import { useForm, useManagedContext } from "../../../../../hooks"
import { InputSecret } from "../../../../../common"
    
const ChangePasswordModal = ({ close, username }) => {
    const [formValues, formHandle] = useForm({ passwordActual: '', passwordNueva: '', passwordRepeat: '',})

    const { setIsLoading } = useManagedContext()

    const onAccept = () => {
        if (formValues.passwordNueva === '')
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar una contraseña')

        const validation = validatePassword(formValues.passwordNueva)
        if (!validation.success)
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, validation.message)

        if (formValues.passwordRepeat === '')
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe repetir la contraseña')
        if (formValues.passwordNueva !== formValues.passwordRepeat)
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Las contraseñas deben coincidir')

        setIsLoading(true)
        standardRequest(
            'POST',
            `${APIS.URLS.SEGURIDAD_USUARIO}/replace-password`,
            {
                username,
                oldPassword: encrypt(formValues.passwordActual),
                newPassword: encrypt(formValues.passwordNueva)
            },
        ).then(() => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'La contraseña fue cambiada correctamente', () => {
                setIsLoading(false)
                window.location.href = `${APPCONFIG.SITE.WEBAPP_PRINCIPAL}logout`
            })
        }).catch(e => {
            setIsLoading(false)
            throw e
        })
    }

    return (
        <>
    
        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
          <div className="modal-dialog">
            <div className="modal-content animated fadeIn">
    
              <div className="modal-header">
                <h2 className="modal-title">Cambio de contraseña</h2>
              </div>
    
              <div className="modal-body">
                <div className="row">
    
                    <div className="mb-3 col-12">
                        <InputSecret
                            title="Contraseña actual"
                            htmlFor="codigo"
                            type="password"
                            name="passwordActual"
                            value={formValues.passwordActual}
                            onChange={formHandle}
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="mb-3 col-12">
                        <InputSecret
                            title="Contraseña nueva"
                            htmlFor="codigo"
                            type="password"
                            name="passwordNueva"
                            value={formValues.passwordNueva}
                            onChange={formHandle}
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="mb-3 col-12">
                        <InputSecret
                            title="Repetir contraseña nueva"
                            htmlFor="codigo"
                            type="password"
                            name="passwordRepeat"
                            value={formValues.passwordRepeat}
                            onChange={formHandle}
                            autoComplete="new-password"
                        />
                    </div>
                </div>
              </div>
    
              <div className="modal-footer">
                    <button className="btn btn-outline-primary" data-dismiss="modal" onClick={close}>Cancelar</button>
                    <button className="btn btn-primary" data-dismiss="modal" onClick={onAccept}>Aceptar</button>
              </div>
              
            </div>
          </div>
        </div>
    
        </>
    
            
        )
}

export default ChangePasswordModal
