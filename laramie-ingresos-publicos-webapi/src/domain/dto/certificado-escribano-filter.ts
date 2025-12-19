
export default class CertificadoEscribanoFilter {
	anioCertificado: string;
	numeroCertificado: string;
	idTipoCertificado: number;
	idEscribano: number;
	idCuenta: number;
    etiqueta: string;

    constructor (
        anioCertificado: string = "",
        numeroCertificado: string = "",
        idTipoCertificado: number = 0,
        idEscribano: number = 0,
        idCuenta: number = 0,
        etiqueta: string = ""
    )
    {
        this.anioCertificado = anioCertificado;
        this.numeroCertificado = numeroCertificado;
        this.idTipoCertificado = idTipoCertificado;
        this.idEscribano = idEscribano;
        this.idCuenta = idCuenta;
        this.etiqueta = etiqueta;
    }
    
}
