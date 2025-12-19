import LoginService from '../../domain/services/login-service';
import SesionService from '../../domain/services/sesion-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import { getIPRemote } from '../../infraestructure/sdk/utils/client';
import { isValidString } from '../../infraestructure/sdk/utils/validator';
import { generateAccessToken } from '../authorization/token';

export default class LoginController {

    loginService: LoginService;
    sesionService: SesionService;

    constructor(loginService: LoginService, sesionService: SesionService) {
        this.loginService = loginService;
        this.sesionService = sesionService;
    }

    post = (req, res, next) => {
        const {username, password} = req.body;
        
        this.loginService.findByLogin(username, password)
        .then(row => {

            const ipRemote = getIPRemote(req);
            if (!isValidString(ipRemote, true)) {
                next(new UnauthorizedError('No se pudo identificar la IP del cliente'));
            }
            const perfiles = row["perfiles"];
            const usuario = {
                idUsuario: row["id"],
                idTipoUsuario: row["idTipoUsuario"],
                idEstadoUsuario: row["idEstadoUsuario"],
                idPersona: row["idPersona"],
                codigo: row["codigo"],
                nombreApellido: row["nombreApellido"],
                email: row["email"],
                identificadorFirmaDigital: row["identificadorFirmaDigital"],
                idOficina: row["idOficina"],
                perfiles: perfiles,
                ipRemote: ipRemote
            }
            
            const token = generateAccessToken(usuario);
            if (token) {
                this.sesionService.add(token)
                .catch(error => {
                    next(new UnauthorizedError('Error generando la sesión'));
                });
                
                res.send(token);
            }
            else {
                next(new UnauthorizedError('Error generando Token'));
            }
        
        })
        .catch(error => {
            if (error.statusCode === 404) {
                next(new ValidationError('Usuario o contraseña incorrectos'));
            }
            else {
                next(error);
            }
        })
    }         
}