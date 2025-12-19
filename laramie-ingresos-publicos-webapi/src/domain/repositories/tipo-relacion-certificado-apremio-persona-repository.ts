import TipoRelacionCertificadoApremioPersona from "../entities/tipo-relacion-certificado-apremio-persona";

export default interface ITipoRelacionCertificadoApremioPersonaRepository {

	list();

	findById(id:number);

	add(row:TipoRelacionCertificadoApremioPersona);

	modify(id:number, row:TipoRelacionCertificadoApremioPersona);

	remove(id:number);

}
