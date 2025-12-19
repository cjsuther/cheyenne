import { DataTypes } from 'sequelize';

const InmuebleSchema = {
    id: {
        field: 'id',
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    idCuenta: {
        field: 'id_cuenta',
        type: DataTypes.BIGINT,
        allowNull: true
    },
    idEstadoCarga: {
        field: 'id_estado_carga',
        type: DataTypes.BIGINT,
        allowNull: false
    },
    fechaCargaInicio: {
        field: 'fecha_carga_inicio',
        type: DataTypes.DATE,
        allowNull: false
    },
    fechaCargaFin: {
        field: 'fecha_carga_fin',
        type: DataTypes.DATE,
        allowNull: true
    },
    catastralCir: {
        field: 'catastral_cir',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralSec: {
        field: 'catastral_sec',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralChacra: {
        field: 'catastral_chacra',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralLchacra: {
        field: 'catastral_lchacra',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralQuinta: {
        field: 'catastral_quinta',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralLquinta: {
        field: 'catastral_lquinta',
        type: DataTypes.STRING(20),
        allowNull: false
    },    
    catastralFrac: {
        field: 'catastral_frac',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralLfrac: {
        field: 'catastral_lfrac',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralManz: {
        field: 'catastral_manz',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralLmanz: {
        field: 'catastral_lmanz',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralParc: {
        field: 'catastral_parc',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralLparc: {
        field: 'catastral_lparc',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralSubparc: {
        field: 'catastral_subparc',
        type: DataTypes.STRING(20),
        allowNull: false
    },    
    catastralUfunc: {
        field: 'catastral_ufunc',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralUcomp: {
        field: 'catastral_ucomp',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    catastralRtasPrv: {
        field: 'catastral_rtas_prv',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tributoManz: {
        field: 'tributo_manz',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tributoLote: {
        field: 'tributo_lote',
        type: DataTypes.STRING(20),
        allowNull: false
    },
    tributoEsquina: {
        field: 'tributo_esquina',
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
};

export default InmuebleSchema;
