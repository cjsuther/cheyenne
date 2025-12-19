export default class OrganoJudicial {

    id: number;
	codigoOrganoJudicial: string;
	departamentoJudicial: string;
	fuero: string;
	secretaria: string;

	constructor(
        id: number = 0,
		codigoOrganoJudicial: string = "",
		departamentoJudicial: string = "",
		fuero: string = "",
		secretaria: string = ""
	)
	{
        this.id = id;
		this.codigoOrganoJudicial = codigoOrganoJudicial;
		this.departamentoJudicial = departamentoJudicial;
		this.fuero = fuero;
		this.secretaria = secretaria;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigoOrganoJudicial = row.codigoOrganoJudicial ?? "";
		this.departamentoJudicial = row.departamentoJudicial ?? "";
		this.fuero = row.fuero ?? "";
		this.secretaria = row.secretaria ?? "";
	}

}
