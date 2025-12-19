import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IVehiculoRepository from '../../../domain/repositories/vehiculo-repository';
import Vehiculo from '../../../domain/entities/vehiculo';
import VehiculoRow from '../../../domain/dto/vehiculo-row';
import VehiculoModel from './models/vehiculo-model';
import VehiculoFilter from '../../../domain/dto/vehiculo-filter';


export default class VehiculoRepositorySequelize implements IVehiculoRepository {

    constructor() {

    }

    async listByCuenta(vehiculoFilter: VehiculoFilter) {
        const cursor = await VehiculoModel.sequelize.query(
            `SELECT * FROM vehiculo_lista_cuenta(:p_numero_cuenta,:p_numero_web,:p_numero_documento,:p_id_persona,:p_etiqueta);`,
            {
                replacements: {
                    p_numero_cuenta: vehiculoFilter.numeroCuenta,
                    p_numero_web: vehiculoFilter.numeroWeb,
                    p_numero_documento: vehiculoFilter.numeroDocumento,
                    p_id_persona: vehiculoFilter.idPersona,
                    p_etiqueta: vehiculoFilter.etiqueta
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new VehiculoRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
			item.dominio = row.dominio;
			item.marca = row.marca;
			item.modelo = row.modelo;
            
            return item;
        });

        return result;
    }

    async listByDatos(vehiculoFilter: VehiculoFilter) {
        const cursor = await VehiculoModel.sequelize.query(
            `SELECT * FROM vehiculo_lista_datos(:p_dominio,:p_marca_modelo);`,
            {
                replacements: {
                    p_dominio: vehiculoFilter.dominio,
                    p_marca_modelo: vehiculoFilter.marcaModelo
                }
            }
        );
        const data = cursor[0] as any;
        
        const result = data.map((row) => {
            let item = new VehiculoRow();
            item.id = row.id;
            item.idCuenta = row.id_cuenta;
            item.estadoCarga = row.nombre;
            item.numeroCuenta = row.numero_cuenta;
            item.numeroWeb = row.numero_web;
            item.idEstadoCuenta = row.id_estado_cuenta;
			item.dominio = row.dominio;
			item.marca = row.marca;
			item.modelo = row.modelo;
            
            return item;
        });

        return result;
    }	

    async findById(id:number) {
        const data = await VehiculoModel.findOne({ where: { id: id } });
        const result = (data) ? new Vehiculo(...data.getDataValues()) : null;

        return result;
    }

    async add(row:Vehiculo) {
        const data = await VehiculoModel.create({
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaInicio: row.fechaCargaInicio,
			dominio: row.dominio,
			dominioAnterior: row.dominioAnterior,
			anioModelo: row.anioModelo,
			marca: row.marca,
			codigoMarca: row.codigoMarca,
			modelo: row.modelo,
			idIncisoVehiculo: row.idIncisoVehiculo,
			idTipoVehiculo: row.idTipoVehiculo,
			idCategoriaVehiculo: row.idCategoriaVehiculo,
			numeroMotor: row.numeroMotor,
			marcaMotor: row.marcaMotor,
			numeroChasis: row.numeroChasis,
			serieMotor: row.serieMotor,
			legajo: row.legajo,
			valuacion: row.valuacion,
			peso: row.peso,
			carga: row.carga,
			cilindrada: row.cilindrada,
			idOrigenFabricacion: row.idOrigenFabricacion,
			idCombustible: row.idCombustible,
			idUsoVehiculo: row.idUsoVehiculo,
			idMotivoBajaVehiculo: row.idMotivoBajaVehiculo,
			recupero: row.recupero,
			radicacionAnterior: row.radicacionAnterior,
			fechaAlta: row.fechaAlta,
			fechaPatentamiento: row.fechaPatentamiento,
			fechaRadicacion: row.fechaRadicacion,
			fechaTransferencia: row.fechaTransferencia,
			fechaCompra: row.fechaCompra,
			fechaBaja: row.fechaBaja,
			fechaHabilitacionDesde: row.fechaHabilitacionDesde,
			fechaHabilitacionHasta: row.fechaHabilitacionHasta,
			fechaDDJJ: row.fechaDDJJ            
        });
        const result = new Vehiculo(...data.getDataValues());

        return result;
    }

    async modify(id:number, row:Vehiculo) {
        const affectedCount = await VehiculoModel.update({
            idCuenta: row.idCuenta,
            idEstadoCarga: row.idEstadoCarga,
            fechaCargaFin: row.fechaCargaFin,
			dominio: row.dominio,
			dominioAnterior: row.dominioAnterior,
			anioModelo: row.anioModelo,
			marca: row.marca,
			codigoMarca: row.codigoMarca,
			modelo: row.modelo,
			idIncisoVehiculo: row.idIncisoVehiculo,
			idTipoVehiculo: row.idTipoVehiculo,
			idCategoriaVehiculo: row.idCategoriaVehiculo,
			numeroMotor: row.numeroMotor,
			marcaMotor: row.marcaMotor,
			numeroChasis: row.numeroChasis,
			serieMotor: row.serieMotor,
			legajo: row.legajo,
			valuacion: row.valuacion,
			peso: row.peso,
			carga: row.carga,
			cilindrada: row.cilindrada,
			idOrigenFabricacion: row.idOrigenFabricacion,
			idCombustible: row.idCombustible,
			idUsoVehiculo: row.idUsoVehiculo,
			idMotivoBajaVehiculo: row.idMotivoBajaVehiculo,
			recupero: row.recupero,
			radicacionAnterior: row.radicacionAnterior,
			fechaAlta: row.fechaAlta,
			fechaPatentamiento: row.fechaPatentamiento,
			fechaRadicacion: row.fechaRadicacion,
			fechaTransferencia: row.fechaTransferencia,
			fechaCompra: row.fechaCompra,
			fechaBaja: row.fechaBaja,
			fechaHabilitacionDesde: row.fechaHabilitacionDesde,
			fechaHabilitacionHasta: row.fechaHabilitacionHasta,
			fechaDDJJ: row.fechaDDJJ             
        },
        { where: { id: id } });

        const data = (affectedCount[0] > 0) ? await VehiculoModel.findOne({ where: { id: id } }) : null;
        const result = (data) ? new Vehiculo(...data.getDataValues()) : null;

        return result;
    }

    async remove(id:number) {
        const affectedCount = await VehiculoModel.destroy({ where: { id: id } });
        const result = (affectedCount > 0) ? {id} : null;
        
        return result;
    }

    async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await VehiculoModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
