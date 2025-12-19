import Usuario from '../../domain/entities/usuario';
import UsuarioService from '../../domain/services/usuario-service';


export default class UsuarioController {

  usuarioService: UsuarioService;

  constructor(usuarioService: UsuarioService) {
    this.usuarioService = usuarioService;
  }

  get = (req, res, next) => {
    this.usuarioService.list()
      .then(data => res.send(data))
      .catch(next)
  }

  getById = (req, res, next) => {
    const id = req.params.id;
    this.usuarioService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  getByLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    this.usuarioService.findByLogin(username, password)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const dataBody = {...req.body};
    const usuario = new Usuario(); usuario.setFromObject(dataBody);
    const password = req.body.password;
    this.usuarioService.add(usuario, password)
      .then(row => res.send(row))
      .catch(next)
  }

  put = (req, res, next) => {
    const id = req.params.id;
    const dataBody = {...req.body};
    const usuario = new Usuario(); usuario.setFromObject(dataBody);
    const password = req.body.password;
    this.usuarioService.modify(id, usuario, password)
      .then(row => res.send(row))
      .catch(next)
  }

  delete = (req, res, next) => {
    const id = req.params.id;
    this.usuarioService.remove(id)
      .then(id => res.send(id))
      .catch(next)
  }

  
  putBindPerfiles = (req, res, next) => {
    const id = req.params.id;
    const dataBody = {...req.body};
    const perfiles = dataBody.perfiles;
    this.usuarioService.bindPerfiles(id, perfiles)
      .then(row => res.send(row))
      .catch(next)
  }

  putUnindPerfiles = (req, res, next) => {
    const id = req.params.id;
    const dataBody = {...req.body};
    const perfiles = dataBody.perfiles;
    this.usuarioService.unbindPerfiles(id, perfiles)
      .then(row => res.send(row))
      .catch(next)
  }

  putFindIds = (req, res, next) => {
    const dataBody = {...req.body};
    const ids = dataBody.ids;
    this.usuarioService.findByIds(ids)
      .then(row => res.send(row))
      .catch(next)
  }

  getChangePassword = (req, res, next) => {
    this.usuarioService.getChangePassword(req.params.login)
      .then(row => res.send(row))
      .catch(next)
  }

  putChangePassword = (req, res, next) => {
    this.usuarioService.putChangePassword(req.params.token, req.body.password)
      .then(row => res.send(row))
      .catch(next)
  }

}
