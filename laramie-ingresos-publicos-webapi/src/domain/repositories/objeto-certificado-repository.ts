import ObjetoCertificado from "../entities/objeto-certificado";

export default interface IObjetoCertificadoRepository {

	list();

	findById(id:number);

	add(row:ObjetoCertificado);

	modify(id:number, row:ObjetoCertificado);

	remove(id:number);

}
