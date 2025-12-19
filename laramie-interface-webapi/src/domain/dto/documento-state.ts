import Documento from '../entities/documento';

export default class DocumentoState extends Documento {

    state: string;

	constructor(
        id: number = 0,
		idTipoPersona: number = 0,
		idPersona: number = 0,
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		principal: boolean = false,
		state: string = "o"
	)
	{
		super(id, idTipoPersona, idPersona, idTipoDocumento, numeroDocumento, principal);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.idPersona = row.idPersona ?? 0;
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.principal = row.principal ?? false;
		this.state = row.state ?? "o";
	}

}
