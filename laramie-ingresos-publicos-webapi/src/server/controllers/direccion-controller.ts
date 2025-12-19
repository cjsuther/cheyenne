import Direccion from '../../domain/entities/direccion';
import DireccionService from '../../domain/services/direccion-service';


export default class DireccionController {

  direccionService: DireccionService;

  constructor(direccionService: DireccionService) {
    this.direccionService = direccionService;
  }

  get = (req, res, next) => {
    this.direccionService.list()
      .then(data => res.send(data))
      .catch(next)
  }

  getByEntidad = (req, res, next) => {
    const entidad = req.params.entidad;
    const idEntidad = req.params.idEntidad;
    this.direccionService.listByEntidad(entidad, idEntidad)
      .then(data => res.send(data))
      .catch(next)
  }

  getById = (req, res, next) => {
    const id = req.params.id;
    this.direccionService.findById(id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const dataBody = {...req.body};
    const direccion = new Direccion(); direccion.setFromObject(dataBody);
    this.direccionService.add(direccion)
      .then(row => res.send(row))
      .catch(next)
  }

  put = (req, res, next) => {
    const id = req.params.id;
    const dataBody = {...req.body};
    const direccion = new Direccion(); direccion.setFromObject(dataBody);
    this.direccionService.modify(id, direccion)
      .then(row => res.send(row))
      .catch(next)
  }
  
  delete = (req, res, next) => {
    const id = req.params.id;
    this.direccionService.remove(id)
      .then(id => res.send(id))
      .catch(next)
  }

}
