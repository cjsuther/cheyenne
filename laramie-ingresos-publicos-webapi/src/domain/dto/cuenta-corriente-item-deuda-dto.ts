import CertificadoApremio from '../entities/certificado-apremio';
import CuentaCorrienteCondicionEspecial from '../entities/cuenta-corriente-condicion-especial';
import CuentaCorrienteItemDeuda from '../dto/cuenta-corriente-item-deuda';
import RubroComercio from '../entities/rubro-comercio';


export default class CuentaCorrienteItemDeudaDTO {

    cuentaCorrienteItems?: Array<CuentaCorrienteItemDeuda>;
    certificadosApremio?: Array<CertificadoApremio>;
    rubrosComercio?: Array<RubroComercio>;
    condicionesEspeciales?: Array<CuentaCorrienteCondicionEspecial>;

    constructor(
        cuentaCorrienteItems: Array<CuentaCorrienteItemDeuda> = [],
        certificadosApremio: Array<CertificadoApremio> = [],
        rubrosComercio: Array<RubroComercio> = [],
        condicionesEspeciales: Array<CuentaCorrienteCondicionEspecial> = [])
    {
        this.cuentaCorrienteItems = cuentaCorrienteItems;
        this.certificadosApremio = certificadosApremio;
        this.rubrosComercio = rubrosComercio;
        this.condicionesEspeciales = condicionesEspeciales;
    }

    setFromObject = (row) =>
    {
        this.cuentaCorrienteItems = row.cuentaCorrienteItems.map(x => {
            let item = new CuentaCorrienteItemDeuda();
            item.setFromObject(x);
            return item;
        });
        this.certificadosApremio = row.certificadosApremio.map(x => {
            let item = new CertificadoApremio();
            item.setFromObject(x);
            return item;
        });
        this.rubrosComercio = row.rubrosComercio.map(x => {
            let item = new RubroComercio();
            item.setFromObject(x);
            return item;
        });
        this.condicionesEspeciales = row.condicionesEspeciales.map(x => {
            let item = new CuentaCorrienteCondicionEspecial();
            item.setFromObject(x);
            return item;
        });
    }
    
}
