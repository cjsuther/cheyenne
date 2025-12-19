import ComunicacionService from '../../domain/services/comunicacion-service';
import ListaService from '../../domain/services/lista-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class ComunicacionController {

  comunicacionService: ComunicacionService;

  constructor(comunicacionService: ComunicacionService) {
    this.comunicacionService = comunicacionService;
  }

  postEMail = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      next(new UnauthorizedError('Token inválido'));
      return;
    }

    let idUsuario = 0;
    try {
        if (token) {
            const dataToken = verifyAccessToken(token);
            if (dataToken) {
                idUsuario = dataToken.idUsuario;
            }
        }
    }
    catch {};

		const dataBody = {...req.body};
    const titulo = dataBody.asunto;
    const cuerpo = dataBody.cuerpo;
    const identificador = dataBody.para;
    if (!token || !isValidString(titulo, true) || !isValidString(cuerpo, true) || !isValidString(identificador, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.comunicacionService.addEMail(token, titulo, cuerpo, identificador, idUsuario)
      .then(data => res.send(data))
      .catch(next)
  }

}
