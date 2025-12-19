import ProcessError from '../../infraestructure/sdk/error/process-error';
import Etiqueta from '../../domain/entities/etiqueta';
import EtiquetaService from '../../domain/services/etiqueta-service';

export default class EtiquetaController {

	etiquetaService: EtiquetaService;

	constructor(etiquetaService: EtiquetaService) {
		this.etiquetaService = etiquetaService;
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const etiqueta = new Etiqueta();
		try {
			etiqueta.setFromObject(dataBody);
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}
		this.etiquetaService.add(etiqueta)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.etiquetaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
