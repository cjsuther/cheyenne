
import TipoVinculoCuentaService from "../../domain/services/tipo-vinculo-cuenta-service";

export default class TipoVinculoCuentaController {

	tipoVinculoCuentaService: TipoVinculoCuentaService;

	constructor(tipoVinculoCuentaService: TipoVinculoCuentaService) {
		this.tipoVinculoCuentaService = tipoVinculoCuentaService;
	}

	get = async (req, res, next) => {
		this.tipoVinculoCuentaService.listByTipoTributo(0)
			.then(data => res.send(data))
			.catch(next)
	}

	getByTipoTributo = async (req, res, next) => {
		const idTipoTributo = parseInt(req.params.idTipoTributo);
		this.tipoVinculoCuentaService.listByTipoTributo(idTipoTributo)
			.then(data => res.send(data))
			.catch(next)
	}

}
