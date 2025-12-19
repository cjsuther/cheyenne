
export default class Vehiculo {

    id: number;
    idCuenta: number;
    idEstadoCarga: number;
    fechaCargaInicio: Date;
    fechaCargaFin: Date;
	dominio: string;
	dominioAnterior: string;
	anioModelo: string;
	marca: string;
	codigoMarca: string;
	modelo: string;
	idIncisoVehiculo: number;
	idTipoVehiculo: number;
	idCategoriaVehiculo: number;
	numeroMotor: string;
	marcaMotor: string;
	numeroChasis: string;
	serieMotor: string;
	legajo: string;
	valuacion: number;
	peso: string;
	carga: string;
	cilindrada: string;
	idOrigenFabricacion: number;
	idCombustible: number;
	idUsoVehiculo: number;
	idMotivoBajaVehiculo: number;
	recupero: string;
	radicacionAnterior: string;
	fechaAlta: Date;
	fechaPatentamiento: Date;
	fechaRadicacion: Date;
	fechaTransferencia: Date;
	fechaCompra: Date;
	fechaBaja: Date;
	fechaHabilitacionDesde: Date;
	fechaHabilitacionHasta: Date;
	fechaDDJJ: Date;
	idFirmaDigitalLibreDeuda: number;
	idEstadoFirmaLibreDeuda: number;
	idFirmaDigitalBaja: number;
	idEstadoFirmaBaja: number;
	codigoMTM: string;

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        idEstadoCarga: number = 0,
        fechaCargaInicio: Date = null,
        fechaCargaFin: Date = null,
		dominio: string = "",
		dominioAnterior: string = "",
		anioModelo: string = "",
		marca: string = "",
		codigoMarca: string = "",
		modelo: string = "",
		idIncisoVehiculo: number = 0,
		idTipoVehiculo: number = 0,
		idCategoriaVehiculo: number = 0,
		numeroMotor: string = "",
		marcaMotor: string = "",
		numeroChasis: string = "",
		serieMotor: string = "",
		legajo: string = "",
		valuacion: number = 0,
		peso: string = "",
		carga: string = "",
		cilindrada: string = "",
		idOrigenFabricacion: number = 0,
		idCombustible: number = 0,
		idUsoVehiculo: number = 0,
		idMotivoBajaVehiculo: number = 0,
		recupero: string = "",
		radicacionAnterior: string = "",
		fechaAlta: Date = null,
		fechaPatentamiento: Date = null,
		fechaRadicacion: Date = null,
		fechaTransferencia: Date = null,
		fechaCompra: Date = null,
		fechaBaja: Date = null,
		fechaHabilitacionDesde: Date = null,
		fechaHabilitacionHasta: Date = null,
		fechaDDJJ: Date = null,
		idFirmaDigitalLibreDeuda: number = 0,
		idEstadoFirmaLibreDeuda: number = 0,
		idFirmaDigitalBaja: number = 0,
		idEstadoFirmaBaja: number = 0,
		codigoMTM: string = "")
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.idEstadoCarga = idEstadoCarga;
        this.fechaCargaInicio = fechaCargaInicio;
        this.fechaCargaFin = fechaCargaFin;     
		this.dominio = dominio;
		this.dominioAnterior = dominioAnterior;
		this.anioModelo = anioModelo;
		this.marca = marca;
		this.codigoMarca = codigoMarca;
		this.modelo = modelo;
		this.idIncisoVehiculo = idIncisoVehiculo;
		this.idTipoVehiculo = idTipoVehiculo;
		this.idCategoriaVehiculo = idCategoriaVehiculo;
		this.numeroMotor = numeroMotor;
		this.marcaMotor = marcaMotor;
		this.numeroChasis = numeroChasis;
		this.serieMotor = serieMotor;
		this.legajo = legajo;
		this.valuacion = valuacion;
		this.peso = peso;
		this.carga = carga;
		this.cilindrada = cilindrada;
		this.idOrigenFabricacion = idOrigenFabricacion;
		this.idCombustible = idCombustible;
		this.idUsoVehiculo = idUsoVehiculo;
		this.idMotivoBajaVehiculo = idMotivoBajaVehiculo;
		this.recupero = recupero;
		this.radicacionAnterior = radicacionAnterior;
		this.fechaAlta = fechaAlta;
		this.fechaPatentamiento = fechaPatentamiento;
		this.fechaRadicacion = fechaRadicacion;
		this.fechaTransferencia = fechaTransferencia;
		this.fechaCompra = fechaCompra;
		this.fechaBaja = fechaBaja;
		this.fechaHabilitacionDesde = fechaHabilitacionDesde;
		this.fechaHabilitacionHasta = fechaHabilitacionHasta;
		this.fechaDDJJ = fechaDDJJ;
		this.idFirmaDigitalLibreDeuda = idFirmaDigitalLibreDeuda;
		this.idEstadoFirmaLibreDeuda = idEstadoFirmaLibreDeuda;
		this.idFirmaDigitalBaja = idFirmaDigitalBaja;
		this.idEstadoFirmaBaja = idEstadoFirmaBaja;
		this.codigoMTM = codigoMTM;        
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.idCuenta = row.idCuenta ?? 0;
        this.idEstadoCarga = row.idEstadoCarga ?? 0;
        this.fechaCargaInicio = row.fechaCargaInicio ?? null;
        this.fechaCargaFin = row.fechaCargaFin ?? null;
		this.dominio = row.dominio ?? "";
		this.dominioAnterior = row.dominioAnterior ?? "";
		this.anioModelo = row.anioModelo ?? "";
		this.marca = row.marca ?? "";
		this.codigoMarca = row.codigoMarca ?? "";
		this.modelo = row.modelo ?? "";
		this.idIncisoVehiculo = row.idIncisoVehiculo ?? 0;
		this.idTipoVehiculo = row.idTipoVehiculo ?? 0;
		this.idCategoriaVehiculo = row.idCategoriaVehiculo ?? 0;
		this.numeroMotor = row.numeroMotor ?? "";
		this.marcaMotor = row.marcaMotor ?? "";
		this.numeroChasis = row.numeroChasis ?? "";
		this.serieMotor = row.serieMotor ?? "";
		this.legajo = row.legajo ?? "";
		this.valuacion = row.valuacion ?? 0;
		this.peso = row.peso ?? "";
		this.carga = row.carga ?? "";
		this.cilindrada = row.cilindrada ?? "";
		this.idOrigenFabricacion = row.idOrigenFabricacion ?? 0;
		this.idCombustible = row.idCombustible ?? 0;
		this.idUsoVehiculo = row.idUsoVehiculo ?? 0;
		this.idMotivoBajaVehiculo = row.idMotivoBajaVehiculo ?? 0;
		this.recupero = row.recupero ?? "";
		this.radicacionAnterior = row.radicacionAnterior ?? "";
		this.fechaAlta = row.fechaAlta ?? null;
		this.fechaPatentamiento = row.fechaPatentamiento ?? null;
		this.fechaRadicacion = row.fechaRadicacion ?? null;
		this.fechaTransferencia = row.fechaTransferencia ?? null;
		this.fechaCompra = row.fechaCompra ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
		this.fechaHabilitacionDesde = row.fechaHabilitacionDesde ?? null;
		this.fechaHabilitacionHasta = row.fechaHabilitacionHasta ?? null;
		this.fechaDDJJ = row.fechaDDJJ ?? null;
		this.idFirmaDigitalLibreDeuda = row.idFirmaDigitalLibreDeuda ?? null;
		this.idEstadoFirmaLibreDeuda = row.idEstadoFirmaLibreDeuda ?? null;
		this.idFirmaDigitalBaja = row.idFirmaDigitalBaja ?? null;
		this.idEstadoFirmaBaja = row.idEstadoFirmaBaja ?? null;
		this.codigoMTM = row.codigoMTM ?? ""; 
    }
    
}
