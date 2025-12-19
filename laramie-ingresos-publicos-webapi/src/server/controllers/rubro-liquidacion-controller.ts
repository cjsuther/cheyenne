import RubroLiquidacion from '../../domain/entities/rubro-liquidacion';
import RubroLiquidacionService from '../../domain/services/rubro-liquidacion-service';

export default class RubroLiquidacionController {

	rubroLiquidacionService: RubroLiquidacionService;

	constructor(rubroLiquidacionService: RubroLiquidacionService) {
		this.rubroLiquidacionService = rubroLiquidacionService;
	}

	get = async (req, res, next) => {
		this.rubroLiquidacionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.rubroLiquidacionService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const rubroLiquidacion = new RubroLiquidacion(); rubroLiquidacion.setFromObject(dataBody);
		this.rubroLiquidacionService.add(rubroLiquidacion)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const rubroLiquidacion = new RubroLiquidacion(); rubroLiquidacion.setFromObject(dataBody);
		this.rubroLiquidacionService.modify(id, rubroLiquidacion)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.rubroLiquidacionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
