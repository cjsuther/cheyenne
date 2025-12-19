import CertificadoEscribanoFilter from "../dto/certificado-escribano-filter";
import CertificadoEscribano from "../entities/certificado-escribano";

export default interface ICertificadoEscribanoRepository {

	list();

	listByFilter(tasaFilter: CertificadoEscribanoFilter);

	findById(id:number);

	add(row:CertificadoEscribano);

	modify(id:number, row:CertificadoEscribano);

	remove(id:number);

	onTransaction(request);

}
