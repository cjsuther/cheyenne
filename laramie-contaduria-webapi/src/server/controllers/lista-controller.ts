import ListaService from '../../domain/services/lista-service';


export default class ListaController {

  listaService: ListaService;

  constructor(listaService: ListaService) {
    this.listaService = listaService;
  }

  getByTipo = (req, res, next) => {
    const tipo = req.params.tipo;
    this.listaService.list(tipo)
      .then(data => res.send(data))
      .catch(next)
  }

}
