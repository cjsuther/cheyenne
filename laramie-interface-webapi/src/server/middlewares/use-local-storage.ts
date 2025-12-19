import { createNamespace, getNamespace } from 'cls-hooked';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import { getTokenFromRequest } from '../authorization/token';
import ValidationError from '../../infraestructure/sdk/error/validation-error';


export default function useLocalStorage (req, res, next) {
    try {
        const token = getTokenFromRequest(req);
        let localStorage = getNamespace('LocalStorage');
        if (!localStorage) {
            localStorage = createNamespace('LocalStorage');
        }

        if (!localStorage) {
            next(new ReferenceError('No se pudo instanciar el Local Storage'));
        }
        else {
            localStorage.run(() => {
                localStorage.set("accessToken", token);
                next();
            });
        }
    }
    catch (error) {
        if (error instanceof ValidationError ||
            error instanceof ProcessError ||
            error instanceof ReferenceError) {
            throw error;
        }
        else {
            next(new ProcessError('Error procesando datos', error));
        }
    }
}
