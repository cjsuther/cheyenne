import ICuentaRepository from '../../../domain/repositories/cuenta-repository';
import CuentaModel from './models/cuenta-model';
import ContribuyenteCuentaModel from './models/contribuyente-cuenta-model';
import Cuenta from '../../../domain/entities/cuenta';
import { Op } from 'sequelize';
import CuentaFilter from '../../../domain/dto/cuenta-filter';
import CuentaRow from '../../../domain/dto/cuenta-row';
import CuentaOrdenamiento from '../../../domain/dto/cuenta-ordenamiento';
import CuentaCalculo from '../../../domain/dto/cuenta-calculo';


export default class CuentaRepositorySequelize implements ICuentaRepository {

    constructor() {

    }

    async list() {
        const data = await CuentaModel.findAll();
        const result = data.map((row) => new Cuenta(...row.getDataValues()));

        return result;
    }

    async listByFilter(cuentaFilter:CuentaFilter) {
        const cursor = await CuentaModel.sequelize.query(
            `SELECT * FROM cuenta_lista(:p_id_cuenta, :p_id_tipo_tributo,:p_numero_cuenta,:p_numero_web,:p_id_persona,:p_etiqueta);`,
            {
                replacements: {
                    p_id_cuenta: cuentaFilter.idCuenta,
                    p_id_tipo_tributo: cuentaFilter.idTipoTributo,
                    p_numero_cuenta: cuentaFilter.numeroCuenta,
                    p_numero_web: cuentaFilter.numeroWeb,
                    p_id_persona: cuentaFilter.idPersona,
                    p_etiqueta: cuentaFilter.etiqueta
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new CuentaRow();
            item.id = row.id;
            item.idTipoTributo = row.id_tipo_tributo;
            item.idTributo = row.id_tributo;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idContribuyente = row.id_contribuyente;
            item.idTipoDocumentoContribuyente = row.id_tipo_documento_contribuyente;
            item.numeroDocumentoContribuyente = row.numero_documento_contribuyente;
            item.nombreContribuyente = row.nombre_contribuyente;
            
            return item;
        });

        return result;
    }

    async listByContribuyente(idContribuyente:number) {
        const data = await CuentaModel.findAll(
            {
                include: 
                [{
                    model: ContribuyenteCuentaModel,
                    required: true,
                    as: 'contribuyenteCuenta',
                    where: { idContribuyente: idContribuyente }
                }]
            }
        );
        const result = data.map((row) => new Cuenta(...row.getDataValues()));

        return result;
    }

    async listByPersona(idPersona:number) {
        //falta que filtre por persona
        const data = await CuentaModel.findAll();
        const result = data.map((row) => new Cuenta(...row.getDataValues()));

        return result;
    }

    async listByTipoTributo(idTipoTributo: number) {
        const data = await CuentaModel.findAll({ where: { idTipoTributo: idTipoTributo } });
        const result = data.map((row) => new Cuenta(...row.getDataValues()));

        return result;
    }

    async listByCalculo(idEmisionEjecucion: number) {
        const cursor = await CuentaModel.sequelize.query(
            `SELECT * FROM cuenta_lista_calculo(:p_id_emision_ejecucion);`,
            {
                replacements: {
                    p_id_emision_ejecucion: idEmisionEjecucion
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new CuentaCalculo();
            item.idEmisionEjecucionCuota = row.id_emision_ejecucion_cuota;
            item.idEmisionEjecucionCuenta = row.id_emision_ejecucion_cuenta;
            item.idEmisionCuota = row.id_emision_cuota;
            item.periodo = row.periodo;
            item.numeroEmision = row.numero_emision;
            item.numeroCuenta = row.numero_cuenta;
            item.codigoDelegacion = row.codigo_delegacion;
            item.numeroRecibo = row.numero_recibo;
            item.cuota = row.cuota;
            item.inmCalle = row.inm_calle;
            item.inmAltura = row.inm_altura;
            item.zonCalle = row.zon_calle;
            item.zonAltura = row.zon_altura;
            
            return item;
        });

        return result;
    }

    async listByOrdenamiento(idEmisionEjecucion: number) {
        const cursor = await CuentaModel.sequelize.query(
            `SELECT * FROM cuenta_lista_ordenamiento(:p_id_emision_ejecucion);`,
            {
                replacements: {
                    p_id_emision_ejecucion: idEmisionEjecucion
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new CuentaOrdenamiento();
            item.idEmisionEjecucionCuenta = row.id_emision_ejecucion_cuenta;
            item.numero = row.numero;
            item.numeroCuenta = row.numero_cuenta;
            item.catastralCir = row.catastral_cir;
            item.catastralSec = row.catastral_sec;
            item.catastralChacra = row.catastral_chacra;
            item.catastralLchacra = row.catastral_lchacra;
            item.catastralQuinta = row.catastral_quinta;
            item.catastralLquinta = row.catastral_lquinta;
            item.catastralFrac = row.catastral_frac;
            item.catastralLfrac = row.catastral_lfrac;
            item.catastralManz = row.catastral_manz;
            item.catastralLmanz = row.catastral_lmanz;
            item.catastralParc = row.catastral_parc;
            item.catastralLparc = row.catastral_lparc;
            item.catastralSubparc = row.catastral_subparc;
            item.catastralUfunc = row.catastral_ufunc;
            item.catastralUcomp = row.catastral_ucomp;
            item.inmCalle = row.inm_calle;
            item.inmAltura = row.inm_altura;
            item.inmPiso = row.inm_piso;
            item.inmDpto = row.inm_dpto;
            item.inmReferencia = row.inm_referencia;
            item.zonCalle = row.zon_calle;
            item.zonAltura = row.zon_altura;
            item.zonPiso = row.zon_piso;
            item.zonDpto = row.zon_dpto;
            item.email = row.zon_email;
            item.idControlador = row.id_controlador;
            
            return item;
        });

        return result;
    }

    async findById(id:number) {
        const data = await CuentaModel.findOne({ where: { id: id } });
        const result = (data) ? new Cuenta(...data.getDataValues()) : null;

        return result;
    }

    async findByNumeroCuenta(numeroCuenta:string) {
        const data = await CuentaModel.findOne({ where: { numeroCuenta: numeroCuenta }});
        return (data) ? new Cuenta(...data.getDataValues()) : null;
    }

    async add(row:Cuenta) {
        const data = await CuentaModel.create({
            numeroCuenta: row.numeroCuenta,
            numeroWeb: row.numeroWeb,
            idEstadoCuenta: row.idEstadoCuenta,
            idTipoTributo: row.idTipoTributo,
            idTributo: row.idTributo,
            fechaAlta: row.fechaAlta
        });
        const result = new Cuenta(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Cuenta) {
        const affectedCount = await CuentaModel.update({
            numeroCuenta: row.numeroCuenta,
            numeroWeb: row.numeroWeb,
            idEstadoCuenta: row.idEstadoCuenta,
            fechaBaja: row.fechaBaja,
            idContribuyentePrincipal: row.idContribuyentePrincipal,
            idDireccionPrincipal: row.idDireccionPrincipal,
            idDireccionEntrega: row.idDireccionEntrega
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await CuentaModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Cuenta(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await CuentaModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }


    async checkContribuyente(id:number, idContribuyente:number) {
        const data = await ContribuyenteCuentaModel.findAll({ where: { idCuenta: id, idContribuyente: idContribuyente } });
        const result = (data && data.length);

        return result;
    }

    async bindContribuyentes(id:number, contribuyentes:number[]) {
        const rows = contribuyentes.map(idContribuyente => {
            return {
                idCuenta: id,
                idContribuyente: idContribuyente,
            }
        });

        const affectedCount = await ContribuyenteCuentaModel.bulkCreate(rows);

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

    async unbindContribuyentes(id:number, contribuyentes:number[]) {
        const criteria = contribuyentes.map(idContribuyente => {
            return {
                [Op.and]: [
                    {idCuenta: id}, 
                    {idContribuyente: idContribuyente}
                ]
            }
        });

        const affectedCount = await ContribuyenteCuentaModel.destroy({
            where: {
                [Op.or]: criteria
            }
        });

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

    async unbindAllContribuyentes(id:number) {
        const affectedCount = await ContribuyenteCuentaModel.destroy({ where: { idCuenta: id } });

        const response = { id: id };
        const result = (affectedCount != null) ? response : null;
        return result;
    }

}
