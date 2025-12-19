import Perfil from '../../domain/entities/perfil';
import PerfilService from '../../domain/services/perfil-service';


export default class PerfilController {

  perfilService: PerfilService;

  constructor(perfilService: PerfilService) {
    this.perfilService = perfilService;
  }

  get = (req, res, next) => {
    this.perfilService.list()
      .then(data => res.send(data))
      .catch(next)
  }

  getPermisos = (req, res, next) => {
    this.perfilService.listPermisos()
      .then(data => res.send(data))
      .catch(next)
  }

  getByUsuario = (req, res, next) => {
    const idUsuario = req.params.idUsuario;
    this.perfilService.listByUsuario(idUsuario)
      .then(data => res.send(data))
      .catch(next)
  }

  getById = (req, res, next) => {
    const id = req.params.id;
    this.perfilService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const dataBody = {...req.body};
    const perfil = new Perfil(); perfil.setFromObject(dataBody);
    this.perfilService.add(perfil)
      .then(row => res.send(row))
      .catch(next)
  }

  put = (req, res, next) => {
    const id = req.params.id;
    const dataBody = {...req.body};
    const perfil = new Perfil(); perfil.setFromObject(dataBody);
    this.perfilService.modify(id, perfil)
      .then(row => res.send(row))
      .catch(next)
  }

  delete = (req, res, next) => {
    const id = req.params.id;
    this.perfilService.remove(id)
      .then(id => res.send(id))
      .catch(next)
  }

  putBindPermisos = (req, res, next) => {
    const id = req.params.id;
    const dataBody = {...req.body};
    const permisos = dataBody.permisos;
    this.perfilService.bindPermisos(id, permisos)
      .then(row => res.send(row))
      .catch(next)
  }

  putUnindPermisos = (req, res, next) => {
    const id = req.params.id;
    const dataBody = {...req.body};
    const permisos = dataBody.permisos;
    this.perfilService.unbindPermisos(id, permisos)
      .then(row => res.send(row))
      .catch(next)
  }

}
