import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CatastroSchema from './catastro-schema';

const sequelize = createConnection(true);

class CatastroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("partida"),
		this.getDataValue("digitoVerificador"),
		this.getDataValue("partido"),
		this.getDataValue("circunscripcion"),
		this.getDataValue("seccion"),
		this.getDataValue("chacra"),
		this.getDataValue("letraChacra"),
		this.getDataValue("quinta"),
		this.getDataValue("letraQuinta"),
		this.getDataValue("fraccion"),
		this.getDataValue("letraFraccion"),
		this.getDataValue("manzana"),
		this.getDataValue("letraManzana"),
		this.getDataValue("parcela"),
		this.getDataValue("letraParcela"),
		this.getDataValue("subparcela"),
		this.getDataValue("destinatario"),
		this.getDataValue("calle"),
		this.getDataValue("altura"),
		this.getDataValue("piso"),
		this.getDataValue("departamento"),
		this.getDataValue("barrio"),
		this.getDataValue("entreCalle1"),
		this.getDataValue("entreCalle2"),
		this.getDataValue("localidad"),
		this.getDataValue("codigoPostal"),
		this.getDataValue("vigencia"),
		this.getDataValue("codigoPostalArgentina"),
		parseFloat(this.getDataValue("superficie")),
		this.getDataValue("caracteristica"),
		parseFloat(this.getDataValue("valorTierra")),
		parseFloat(this.getDataValue("superficieEdificada")),
		parseFloat(this.getDataValue("valorEdificado")),
		parseFloat(this.getDataValue("valor1998")),
		parseFloat(this.getDataValue("valorMejoras")),
		parseFloat(this.getDataValue("edif1997")),
		parseFloat(this.getDataValue("valorFiscal")),
		parseFloat(this.getDataValue("mejoras1997")),
		this.getDataValue("origen"),
		this.getDataValue("motivoMovimiento"),
		this.getDataValue("titular"),
		this.getDataValue("codigoTitular"),
		this.getDataValue("dominioOrigen"),
		this.getDataValue("dominioInscripcion"),
		this.getDataValue("dominioTipo"),
		this.getDataValue("dominioAnio"),
		this.getDataValue("unidadesFuncionales"),
		this.getDataValue("serie")
	];

}

CatastroModel.init(CatastroSchema, {
  sequelize,
  modelName: 'Catastro',
  tableName: 'catastro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CatastroModel;
