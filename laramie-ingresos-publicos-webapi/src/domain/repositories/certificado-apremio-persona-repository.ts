import CertificadoApremioPersona from "../entities/certificado-apremio-persona";

export default interface ICertificadoApremioPersonaRepository {

	listByCertificadoApremio(idCertificadoApremio: number);

	findById(id:number);

	add(row:CertificadoApremioPersona);

	modify(id:number, row:CertificadoApremioPersona);

	remove(id:number);

	removeByCertificadoApremio(idCertificadoApremio: number);

}
