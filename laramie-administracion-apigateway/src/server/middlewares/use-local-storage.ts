import { createNamespace, getNamespace } from 'cls-hooked';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';


export default function useLocalStorage (req, res, next) {

    let localStorage = getNamespace('LocalStorage');
    if (!localStorage) {
        localStorage = createNamespace('LocalStorage');
    }

    if (!localStorage) {
        next(new ReferenceError('No se pudo instanciar el Local Storage'));
    }
    else {
        next();
    }

}

