import EntidadService from '../../domain/services/entidad-service';


export default class EntidadController {

  entidadService: EntidadService;

  constructor(entidadService: EntidadService) {
    this.entidadService = entidadService;
  }

  getByTipo = (req, res, next) => {
    const tipo = req.params.tipo;
    this.entidadService.list(tipo)
      .then(data => res.send(data))
      .catch(next)
  }

}
