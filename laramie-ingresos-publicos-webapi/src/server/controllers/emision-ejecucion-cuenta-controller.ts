import EmisionEjecucionCuenta from '../../domain/entities/emision-ejecucion-cuenta';
import EmisionEjecucionCuentaService from '../../domain/services/emision-ejecucion-cuenta-service';

export default class EmisionEjecucionCuentaController {

	emisionEjecucionCuentaService: EmisionEjecucionCuentaService;

	constructor(emisionEjecucionCuentaService: EmisionEjecucionCuentaService) {
		this.emisionEjecucionCuentaService = emisionEjecucionCuentaService;
	}

	getResume = (req, res, next) => {
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		this.emisionEjecucionCuentaService.listResume(idEmisionEjecucion)
			.then(data => res.send(data))
			.catch(next)
	}

	getByNumero = (req, res, next) => {
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		const numero = req.params.numero;
		this.emisionEjecucionCuentaService.findByNumero(idEmisionEjecucion, numero)
			.then(row => res.send(row))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		const idCuenta = req.params.idCuenta;
		this.emisionEjecucionCuentaService.findByCuenta(idEmisionEjecucion, idCuenta)
			.then(row => res.send(row))
			.catch(next)
	}

}
