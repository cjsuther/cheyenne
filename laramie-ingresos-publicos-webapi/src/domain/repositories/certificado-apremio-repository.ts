import CertificadoApremioFilter from "../dto/certificado-apremio-filter";
import CertificadoApremio from "../entities/certificado-apremio";

export default interface ICertificadoApremioRepository {

	list();

	listByFilter(certificadoApremioFilter: CertificadoApremioFilter);

	listByApremio(idApremio: number);

	listByCuenta(idCuenta: number);

	findById(id:number);

	add(row:CertificadoApremio);

	modify(id:number, row:CertificadoApremio);

	remove(id:number);

	onTransaction(request);

}
