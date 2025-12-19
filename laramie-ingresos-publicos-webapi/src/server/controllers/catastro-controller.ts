import Catastro from '../../domain/entities/catastro';
import CatastroService from '../../domain/services/catastro-service';

export default class CatastroController {

	catastroService: CatastroService;

	constructor(catastroService: CatastroService) {
		this.catastroService = catastroService;
	}

	get = (req, res, next) => {
		this.catastroService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.catastroService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByPartida = (req, res, next) => {
		const partida = req.params.partida;
		this.catastroService.findByPartida(partida)
			.then(row => res.send(row))
			.catch(next)
	}

	getByNomenclatura = (req, res, next) => {
		const circunscripcion = req.query.circunscripcion;
		const seccion = req.query.seccion;
		const fraccion = req.query.fraccion;
		const letraFraccion = req.query.letraFraccion;
		const manzana = req.query.manzana;
		const letraManzana = req.query.letraManzana;
		const parcela = req.query.parcela;
		const letraParcela = req.query.letraParcela;
		const chacra = req.query.chacra;
		const letraChacra = req.query.letraChacra;
		const quinta = req.query.quinta;
		const letraQuinta = req.query.letraQuinta;
		const subparcela = req.query.subparcela;

		this.catastroService.findByNomenclatura(circunscripcion, seccion, chacra, letraChacra, quinta, letraQuinta, fraccion, letraFraccion, manzana, letraManzana, parcela, letraParcela, subparcela)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const catastro = new Catastro(); catastro.setFromObject(dataBody);
		this.catastroService.add(catastro)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const catastro = new Catastro(); catastro.setFromObject(dataBody);
		this.catastroService.modify(id, catastro)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.catastroService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
