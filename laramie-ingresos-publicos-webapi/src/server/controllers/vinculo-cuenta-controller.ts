import VinculoCuentaService from '../../domain/services/vinculo-cuenta-service';

export default class VinculoCuentaController {

	vinculoCuentaService: VinculoCuentaService;

	constructor(vinculoCuentaService: VinculoCuentaService) {
		this.vinculoCuentaService = vinculoCuentaService;
	}

	getByTributo = (req, res, next) => {
		const idTipoTributo = parseInt(req.params.idTipoTributo);
		const idTributo = parseInt(req.params.idTributo);
		this.vinculoCuentaService.listByTributo(idTipoTributo, idTributo)
			.then(data => res.send(data))
			.catch(next)
	}

}
