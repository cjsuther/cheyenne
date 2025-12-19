import OrganoJudicial from "../entities/organo-judicial";

export default interface IOrganoJudicialRepository {

	list();

	findById(id:number);

	add(row:OrganoJudicial);

	modify(id:number, row:OrganoJudicial);

	remove(id:number);

}
