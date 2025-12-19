import PagoContadoDefinicion from "../entities/pago-contado-definicion";
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import PagoContadoDefinicionAlcanceTasaState from "./pago-contado-definicion-alcance-tasa-state";
import PagoContadoDefinicionAlcanceRubroState from "./pago-contado-definicion-alcance-rubro-state";
import PagoContadoDefinicionAlcanceGrupoState from "./pago-contado-definicion-alcance-grupo-state";
import PagoContadoDefinicionAlcanceZonaTarifariaState from "./pago-contado-definicion-alcance-zona-tarifaria-state";
import PagoContadoDefinicionAlcanceCondicionFiscalState from "./pago-contado-definicion-alcance-condicion-fiscal-state";
import PagoContadoDefinicionAlcanceRubroAfipState from "./pago-contado-definicion-alcance-rubro-afip-state";
import PagoContadoDefinicionAlcanceFormaJuridicaState from "./pago-contado-definicion-alcance-forma-juridica-state";
import PagoContadoDefinicionTipoVinculoCuentaState from "./pago-contado-definicion-tipo-vinculo-cuenta-state";

export default class PagoContadoDefinicionDTO {

    pagoContadoDefinicion?: PagoContadoDefinicion;

    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

    pagosContadoDefinicionAlcanceTasa: Array<PagoContadoDefinicionAlcanceTasaState>;
    pagosContadoDefinicionAlcanceRubro: Array<PagoContadoDefinicionAlcanceRubroState>;
    pagosContadoDefinicionAlcanceGrupo: Array<PagoContadoDefinicionAlcanceGrupoState>;
    pagosContadoDefinicionAlcanceZonaTarifaria: Array<PagoContadoDefinicionAlcanceZonaTarifariaState>;
    pagosContadoDefinicionAlcanceCondicionFiscal: Array<PagoContadoDefinicionAlcanceCondicionFiscalState>;
    pagosContadoDefinicionAlcanceRubroAfip: Array<PagoContadoDefinicionAlcanceRubroAfipState>;
    pagosContadoDefinicionAlcanceFormaJuridica: Array<PagoContadoDefinicionAlcanceFormaJuridicaState>;
    pagosContadoDefinicionTipoVinculoCuenta: Array<PagoContadoDefinicionTipoVinculoCuentaState>;

	constructor(
        pagoContadoDefinicion: PagoContadoDefinicion = new PagoContadoDefinicion(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        pagosContadoDefinicionAlcanceTasa: Array<PagoContadoDefinicionAlcanceTasaState> = [],
        pagosContadoDefinicionAlcanceRubro: Array<PagoContadoDefinicionAlcanceRubroState> = [],
        pagosContadoDefinicionAlcanceGrupo: Array<PagoContadoDefinicionAlcanceGrupoState> = [],
        pagosContadoDefinicionAlcanceZonaTarifaria: Array<PagoContadoDefinicionAlcanceZonaTarifariaState> = [],
        pagosContadoDefinicionAlcanceCondicionFiscal: Array<PagoContadoDefinicionAlcanceCondicionFiscalState> = [],
        pagosContadoDefinicionAlcanceRubroAfip: Array<PagoContadoDefinicionAlcanceRubroAfipState> = [],
        pagosContadoDefinicionAlcanceFormaJuridica: Array<PagoContadoDefinicionAlcanceFormaJuridicaState> = [],
        pagosContadoDefinicionTipoVinculoCuenta: Array<PagoContadoDefinicionTipoVinculoCuentaState> = [],
	)
	{
        this.pagoContadoDefinicion = pagoContadoDefinicion;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.pagosContadoDefinicionAlcanceTasa = pagosContadoDefinicionAlcanceTasa;
        this.pagosContadoDefinicionAlcanceRubro = pagosContadoDefinicionAlcanceRubro;
        this.pagosContadoDefinicionAlcanceGrupo = pagosContadoDefinicionAlcanceGrupo;
        this.pagosContadoDefinicionAlcanceZonaTarifaria = pagosContadoDefinicionAlcanceZonaTarifaria;
        this.pagosContadoDefinicionAlcanceCondicionFiscal = pagosContadoDefinicionAlcanceCondicionFiscal;
        this.pagosContadoDefinicionAlcanceRubroAfip = pagosContadoDefinicionAlcanceRubroAfip;
        this.pagosContadoDefinicionAlcanceFormaJuridica = pagosContadoDefinicionAlcanceFormaJuridica;
        this.pagosContadoDefinicionTipoVinculoCuenta = pagosContadoDefinicionTipoVinculoCuenta;
	}

	setFromObject = (row) =>
	{
        this.pagoContadoDefinicion.setFromObject(row.pagoContadoDefinicion);
        this.archivos = row.archivos.map(x => {
            let item = new ArchivoState();
            item.setFromObject(x);
            return item;
        });
        this.observaciones = row.observaciones.map(x => {
            let item = new ObservacionState();
            item.setFromObject(x);
            return item;
        });
        this.etiquetas = row.etiquetas.map(x => {
            let item = new EtiquetaState();
            item.setFromObject(x);
            return item;
        });
        this.pagosContadoDefinicionAlcanceTasa = row.pagosContadoDefinicionAlcanceTasa.map(x => {
            let item = new PagoContadoDefinicionAlcanceTasaState();
            item.setFromObject(x);
            return item;
        });
        this.pagosContadoDefinicionAlcanceRubro = row.pagosContadoDefinicionAlcanceRubro.map(x => {
            let item = new PagoContadoDefinicionAlcanceRubroState();
            item.setFromObject(x);
            return item;
        });
        this.pagosContadoDefinicionAlcanceGrupo = row.pagosContadoDefinicionAlcanceGrupo.map(x => {
            let item = new PagoContadoDefinicionAlcanceGrupoState();
            item.setFromObject(x);
            return item;
        });
        this.pagosContadoDefinicionAlcanceZonaTarifaria = row.pagosContadoDefinicionAlcanceZonaTarifaria.map(x => {
            let item = new PagoContadoDefinicionAlcanceZonaTarifariaState();
            item.setFromObject(x);
            return item;
        });
        this.pagosContadoDefinicionAlcanceCondicionFiscal = row.pagosContadoDefinicionAlcanceCondicionFiscal.map(x => {
            let item = new PagoContadoDefinicionAlcanceCondicionFiscalState();
            item.setFromObject(x);
            return item;
        });
        this.pagosContadoDefinicionAlcanceRubroAfip = row.pagosContadoDefinicionAlcanceRubroAfip.map(x => {
            let item = new PagoContadoDefinicionAlcanceRubroAfipState();
            item.setFromObject(x);
            return item;
        });
        this.pagosContadoDefinicionAlcanceFormaJuridica = row.pagosContadoDefinicionAlcanceFormaJuridica.map(x => {
            let item = new PagoContadoDefinicionAlcanceFormaJuridicaState();
            item.setFromObject(x);
            return item;
        });
        this.pagosContadoDefinicionTipoVinculoCuenta = row.pagosContadoDefinicionTipoVinculoCuenta.map(x => {
            let item = new PagoContadoDefinicionTipoVinculoCuentaState();
            item.setFromObject(x);
            return item;
        });
	}

}
