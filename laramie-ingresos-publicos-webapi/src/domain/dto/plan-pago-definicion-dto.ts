import PlanPagoDefinicion from '../entities/plan-pago-definicion';
import ArchivoState from './archivo-state';
import ObservacionState from './observacion-state';
import EtiquetaState from './etiqueta-state';
import PlanPagoDefinicionAlcanceTasaState from './plan-pago-definicion-alcance-tasa-state';
import PlanPagoDefinicionAlcanceRubroState from './plan-pago-definicion-alcance-rubro-state';
import PlanPagoDefinicionAlcanceGrupoState from './plan-pago-definicion-alcance-grupo-state';
import PlanPagoDefinicionAlcanceZonaTarifariaState from './plan-pago-definicion-alcance-zona-tarifaria-state';
import PlanPagoDefinicionAlcanceCondicionFiscalState from './plan-pago-definicion-alcance-condicion-fiscal-state';
import PlanPagoDefinicionAlcanceRubroAfipState from './plan-pago-definicion-alcance-rubro-afip-state';
import PlanPagoDefinicionAlcanceFormaJuridicaState from './plan-pago-definicion-alcance-forma-juridica-state';
import PlanPagoDefinicionQuitaCuotaState from './plan-pago-definicion-quita-cuota-state';
import PlanPagoDefinicionInteresState from './plan-pago-definicion-interes-state';
import PlanPagoDefinicionTipoVinculoCuentaState from './plan-pago-definicion-tipo-vinculo-cuenta-state';

export default class PlanPagoDefinicionDTO {

    planPagoDefinicion?: PlanPagoDefinicion;

    archivos: Array<ArchivoState>;
    observaciones: Array<ObservacionState>;
    etiquetas: Array<EtiquetaState>;

    planPagosDefinicionAlcanceTasa: Array<PlanPagoDefinicionAlcanceTasaState>;
    planPagosDefinicionAlcanceRubro: Array<PlanPagoDefinicionAlcanceRubroState>;
    planPagosDefinicionAlcanceGrupo: Array<PlanPagoDefinicionAlcanceGrupoState>;
    planPagosDefinicionAlcanceZonaTarifaria: Array<PlanPagoDefinicionAlcanceZonaTarifariaState>;
    planPagosDefinicionAlcanceCondicionFiscal: Array<PlanPagoDefinicionAlcanceCondicionFiscalState>;
    planPagosDefinicionAlcanceRubroAfip: Array<PlanPagoDefinicionAlcanceRubroAfipState>;
    planPagosDefinicionAlcanceFormaJuridica: Array<PlanPagoDefinicionAlcanceFormaJuridicaState>;
    planPagosDefinicionQuitaCuota: Array<PlanPagoDefinicionQuitaCuotaState>;
    planPagosDefinicionInteres: Array<PlanPagoDefinicionInteresState>;
    planPagosDefinicionTipoVinculoCuenta: Array<PlanPagoDefinicionTipoVinculoCuentaState>;

    constructor(
        planPagoDefinicion: PlanPagoDefinicion = new PlanPagoDefinicion(),
        archivos: Array<ArchivoState> = [],
        observaciones: Array<ObservacionState> = [],
        etiquetas: Array<EtiquetaState> = [],
        planPagosDefinicionAlcanceTasa: Array<PlanPagoDefinicionAlcanceTasaState> = [],
        planPagosDefinicionAlcanceRubro: Array<PlanPagoDefinicionAlcanceRubroState> = [],
        planPagosDefinicionAlcanceGrupo: Array<PlanPagoDefinicionAlcanceGrupoState> = [],
        planPagosDefinicionAlcanceZonaTarifaria: Array<PlanPagoDefinicionAlcanceZonaTarifariaState> = [],
        planPagosDefinicionAlcanceCondicionFiscal: Array<PlanPagoDefinicionAlcanceCondicionFiscalState> = [],
        planPagosDefinicionAlcanceRubroAfip: Array<PlanPagoDefinicionAlcanceRubroAfipState> = [],
        planPagosDefinicionAlcanceFormaJuridica: Array<PlanPagoDefinicionAlcanceFormaJuridicaState> = [],
        planPagosDefinicionQuitaCuota: Array<PlanPagoDefinicionQuitaCuotaState> = [],
        planPagosDefinicionInteres: Array<PlanPagoDefinicionInteresState> = [],
        planPagosDefinicionTipoVinculoCuenta: Array<PlanPagoDefinicionTipoVinculoCuentaState> = []
    )
    {
        this.planPagoDefinicion = planPagoDefinicion;
        this.archivos = archivos;
        this.observaciones = observaciones;
        this.etiquetas = etiquetas;
        this.planPagosDefinicionAlcanceTasa = planPagosDefinicionAlcanceTasa;
        this.planPagosDefinicionAlcanceRubro = planPagosDefinicionAlcanceRubro;
        this.planPagosDefinicionAlcanceGrupo = planPagosDefinicionAlcanceGrupo;
        this.planPagosDefinicionAlcanceZonaTarifaria = planPagosDefinicionAlcanceZonaTarifaria;
        this.planPagosDefinicionAlcanceCondicionFiscal = planPagosDefinicionAlcanceCondicionFiscal;
        this.planPagosDefinicionAlcanceRubroAfip = planPagosDefinicionAlcanceRubroAfip;
        this.planPagosDefinicionAlcanceFormaJuridica = planPagosDefinicionAlcanceFormaJuridica;
        this.planPagosDefinicionQuitaCuota = planPagosDefinicionQuitaCuota;
        this.planPagosDefinicionInteres = planPagosDefinicionInteres;
        this.planPagosDefinicionTipoVinculoCuenta = planPagosDefinicionTipoVinculoCuenta;
    }

    setFromObject = (row) =>
    {
        this.planPagoDefinicion.setFromObject(row.planPagoDefinicion);
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
        this.planPagosDefinicionAlcanceTasa = row.planPagosDefinicionAlcanceTasa.map(x => {
            let item = new PlanPagoDefinicionAlcanceTasaState();
            item.setFromObject(x);
            return item;
        });
        this.planPagosDefinicionAlcanceRubro = row.planPagosDefinicionAlcanceRubro.map(x => {
            let item = new PlanPagoDefinicionAlcanceRubroState();
            item.setFromObject(x);
            return item;
        });
        this.planPagosDefinicionAlcanceGrupo = row.planPagosDefinicionAlcanceGrupo.map(x => {
            let item = new PlanPagoDefinicionAlcanceGrupoState();
            item.setFromObject(x);
            return item;
        });
        this.planPagosDefinicionAlcanceZonaTarifaria = row.planPagosDefinicionAlcanceZonaTarifaria.map(x => {
            let item = new PlanPagoDefinicionAlcanceZonaTarifariaState();
            item.setFromObject(x);
            return item;
        });
        this.planPagosDefinicionAlcanceCondicionFiscal = row.planPagosDefinicionAlcanceCondicionFiscal.map(x => {
            let item = new PlanPagoDefinicionAlcanceCondicionFiscalState();
            item.setFromObject(x);
            return item;
        });
        this.planPagosDefinicionAlcanceRubroAfip = row.planPagosDefinicionAlcanceRubroAfip.map(x => {
            let item = new PlanPagoDefinicionAlcanceRubroAfipState();
            item.setFromObject(x);
            return item;
        });
        this.planPagosDefinicionAlcanceFormaJuridica = row.planPagosDefinicionAlcanceFormaJuridica.map(x => {
            let item = new PlanPagoDefinicionAlcanceFormaJuridicaState();
            item.setFromObject(x);
            return item;
        });
        this.planPagosDefinicionQuitaCuota = row.planPagosDefinicionQuitaCuota.map(x => {
            let item = new PlanPagoDefinicionQuitaCuotaState();
            item.setFromObject(x);
            return item;
        });
        this.planPagosDefinicionInteres = row.planPagosDefinicionInteres.map(x => {
            let item = new PlanPagoDefinicionInteresState();
            item.setFromObject(x);
            return item;
        });
        this.planPagosDefinicionTipoVinculoCuenta = row.planPagosDefinicionTipoVinculoCuenta.map(x => {
            let item = new PlanPagoDefinicionTipoVinculoCuentaState();
            item.setFromObject(x);
            return item;
        });
    }
    
}
