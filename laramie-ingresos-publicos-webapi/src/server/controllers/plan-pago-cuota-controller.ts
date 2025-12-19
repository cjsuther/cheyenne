import PlanPagoCuota from '../../domain/entities/plan-pago-cuota';
import PlanPagoCuotaService from '../../domain/services/plan-pago-cuota-service';

export default class PlanPagoCuotaController {

	planPagoCuotaService: PlanPagoCuotaService;

	constructor(planPagoCuotaService: PlanPagoCuotaService) {
		this.planPagoCuotaService = planPagoCuotaService;
	}

	get = (req, res, next) => {
		this.planPagoCuotaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.planPagoCuotaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const planPagoCuota = new PlanPagoCuota(); planPagoCuota.setFromObject(dataBody);
		this.planPagoCuotaService.add(planPagoCuota)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const planPagoCuota = new PlanPagoCuota(); planPagoCuota.setFromObject(dataBody);
		this.planPagoCuotaService.modify(id, planPagoCuota)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.planPagoCuotaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
