import CertificadoApremio from '../entities/certificado-apremio';
import Cuenta from '../entities/cuenta';
import CuentaCorrienteItem from '../entities/cuenta-corriente-item';
import CuotaPorcentaje from '../entities/cuota-porcentaje';
import EdesurCliente from '../entities/edesur-cliente';
import EmisionEjecucion from '../entities/emision-ejecucion';
import SubTasa from '../entities/sub-tasa';
import Tasa from '../entities/tasa';


export default class CuentaCorrienteItemDTO {

    cuentaCorrienteItem?: CuentaCorrienteItem;
    emisionEjecucion?: EmisionEjecucion;
    certificadoApremio?: CertificadoApremio;
    cuenta?: Cuenta;
    tasa?: Tasa;
    subTasa?: SubTasa;
    edesurCliente?: EdesurCliente;
    cuotaPorcentajes: Array<CuotaPorcentaje>;
    observacion: string;

    constructor(
        cuentaCorrienteItem: CuentaCorrienteItem = new CuentaCorrienteItem(),
        emisionEjecucion: EmisionEjecucion = new EmisionEjecucion(),
        certificadoApremio: CertificadoApremio = new CertificadoApremio(),
        cuenta: Cuenta = new Cuenta(),
        tasa: Tasa = new Tasa(),
        subTasa: SubTasa = new SubTasa(),
        edesurCliente: EdesurCliente = new EdesurCliente(),
        cuotaPorcentajes: Array<CuotaPorcentaje> = [],
        observacion: string = "")
    {
        this.cuentaCorrienteItem = cuentaCorrienteItem;
        this.emisionEjecucion = emisionEjecucion;
        this.certificadoApremio = certificadoApremio;
        this.cuenta = cuenta;
        this.tasa = tasa;
        this.subTasa = subTasa;
        this.edesurCliente = edesurCliente;
        this.cuotaPorcentajes = cuotaPorcentajes;
        this.observacion = observacion;
    }

    setFromObject = (row) =>
    {
        this.cuentaCorrienteItem.setFromObject(row.cuentaCorrienteItem);
        this.emisionEjecucion.setFromObject(row.emisionEjecucion);
        this.certificadoApremio.setFromObject(row.certificadoApremio);
        this.cuenta.setFromObject(row.cuenta);
        this.tasa.setFromObject(row.tasa);
        this.subTasa.setFromObject(row.subTasa);
        this.edesurCliente.setFromObject(row.edesurCliente);
        this.cuotaPorcentajes = row.cuotaPorcentajes.map(x => {
            let item = new CuotaPorcentaje();
            item.setFromObject(x);
            return item;
        });
        this.observacion = row.observacion;
    }
    
}
