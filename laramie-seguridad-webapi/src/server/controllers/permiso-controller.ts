import PermisoService from '../../domain/services/permiso-service';

export default class PermisoController {

  permisoService: PermisoService;

  constructor(permisoService: PermisoService) {
    this.permisoService = permisoService;
  }

  get = (req, res, next) => {
    this.permisoService.list()
      .then(data => res.send(data))
      .catch(next)
  }

  getByPerfil = (req, res, next) => {
    const idPerfil = req.params.idPerfil;
    this.permisoService.listByPerfil(idPerfil)
      .then(data => res.send(data))
      .catch(next)
  }

  getByUsuario = (req, res, next) => {
    const idUsuario = req.params.idUsuario;
    this.permisoService.listByUsuario(idUsuario)
      .then(data => res.send(data))
      .catch(next)
  }

  putByUsuario = (req, res, next) => {
    const idUsuario = req.body.idUsuario;
    const codigoPermiso = req.body.codigoPermiso;
    this.permisoService.checkPermisos(idUsuario, codigoPermiso)
      .then(data => res.send(data))
      .catch(next)
  }

  getById = (req, res, next) => {
    const id = req.params.id;
    this.permisoService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

}
