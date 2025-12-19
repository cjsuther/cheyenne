import EntidadService from '../../domain/services/entidad-service';


export default class EntidadController {

  entidadService: EntidadService;

  constructor(entidadService: EntidadService) {
    this.entidadService = entidadService;
  }

  getByDefinicion = (req, res, next) => {
    this.entidadService.listByDefinicion()
      .then(data => res.send(data))
      .catch(next)
  }

  getByTipo = (req, res, next) => {
    const tipo = req.params.tipo;
    this.entidadService.list(tipo)
      .then(data => res.send(data))
      .catch(next)
  }

}
