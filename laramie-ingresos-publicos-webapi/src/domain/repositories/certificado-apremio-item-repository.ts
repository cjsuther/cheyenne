import CertificadoApremioItem from "../entities/certificado-apremio-item";

export default interface ICertificadoApremioItemRepository {

	list();

	listByCertificadoApremio(idCertificadoApremio: number);

	findById(id:number);

	add(row:CertificadoApremioItem);

	modify(id:number, row:CertificadoApremioItem);

	remove(id:number);

	removeByCertificadoApremio(idCertificadoApremio: number);

}
