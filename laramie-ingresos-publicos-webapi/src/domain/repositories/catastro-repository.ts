import Catastro from "../entities/catastro";

export default interface ICatastroRepository {

	list();

	findById(id:number);

	findByPartida(partida:string);

	findByNomenclatura(circunscripcion: string, seccion: string, chacra: string, letraChacra: string, quinta: string, letraQuinta: string, fraccion: string, letraFraccion: string, manzana: string, letraManzana: string, parcela: string, letraParcela: string, subparcela: string);

	add(row:Catastro);

	modify(id:number, row:Catastro);

	remove(id:number);

}
