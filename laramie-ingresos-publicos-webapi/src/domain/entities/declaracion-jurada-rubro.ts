export default class DeclaracionJuradaRubro {

    id: number;
	idDeclaracionJuradaComercio: number;
	idRubroComercio: number;
	importeIngresosBrutos: number;
	importeDeducciones: number;
	importeIngresosNetos: number;

	constructor(
        id: number = 0,
		idDeclaracionJuradaComercio: number = 0,
		idRubroComercio: number = 0,
		importeIngresosBrutos: number = 0,
		importeDeducciones: number = 0,
		importeIngresosNetos: number = 0
	)
	{
        this.id = id;
		this.idDeclaracionJuradaComercio = idDeclaracionJuradaComercio;
		this.idRubroComercio = idRubroComercio;
		this.importeIngresosBrutos = importeIngresosBrutos;
		this.importeDeducciones = importeDeducciones;
		this.importeIngresosNetos = importeIngresosNetos;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idDeclaracionJuradaComercio = row.idDeclaracionJuradaComercio ?? 0;
		this.idRubroComercio = row.idRubroComercio ?? 0;
		this.importeIngresosBrutos = row.importeIngresosBrutos ?? 0;
		this.importeDeducciones = row.importeDeducciones ?? 0;
		this.importeIngresosNetos = row.importeIngresosNetos ?? 0;
	}

}
