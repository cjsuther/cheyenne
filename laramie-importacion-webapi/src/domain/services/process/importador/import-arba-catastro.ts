import fs from 'fs';
import moment from 'moment';
import config from '../../../../server/configuration/config';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import PublishService from "../../publish-service";
import { castPublicError, getDateNow } from "../../../../infraestructure/sdk/utils/convert";
import { getNamespace } from "cls-hooked";
import { verifyAccessToken } from "../../../../server/authorization/token";
import ReferenceError from "../../../../infraestructure/sdk/error/reference-error";
import ListaService from "../../lista-service";
import CatastroService from "../../catastro-service";
import { ensureDirectoryExistence } from '../../../../infraestructure/sdk/utils/helper';
import Catastro from '../../../dto/arba-catastro/catastro';
import { isEmpty } from 'validator';

export default class ImportARBACatastro {

    IMPORT_ARBA_RABBIT_QUEUE = "laramie-importacion-webapi/services/import-arba-catastro";

    publishService: PublishService;
    listaService: ListaService;
    catastroService: CatastroService;

    constructor(publishService: PublishService,
        listaService: ListaService,
        catastroService: CatastroService) {
        this.publishService = publishService;
        this.listaService = listaService;
        this.catastroService = catastroService;
    }

    async import(path: string, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const pathFileSource = `${config.PATH.TEMP}${path}`;
                const content = fs.readFileSync(pathFileSource, { encoding: 'utf8', flag: 'r' });
                const rows = content.split('\n');

                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");

                try {
                    const dataToken = verifyAccessToken(token);
                    if (dataToken) {
                        idUsuario = dataToken.idUsuario;
                    }
                }
                catch {
                    reject(new ReferenceError('Token incorrecto'));
                    return;
                };

                const data = {
                    token: token,
                    idTipoEvento: 22, //Interfaz
                    idUsuario: idUsuario,
                    fecha: getDateNow(true),
                    idModulo: 30,
                    origen: this.IMPORT_ARBA_RABBIT_QUEUE,
                    mensaje: "Importacion ARBA CATASTRO",
                    data: {
                        file: path
                    }
                };

                await this.publishService.sendMessage(`${this.IMPORT_ARBA_RABBIT_QUEUE}`, "AddEvento", idUsuario.toString(), data);

                let alta = [];

                for (let i = 0; i < rows.length; i++) {
                    //alta impositiva
                    const row = rows[i];
                    if (isEmpty(row)) continue;
                    
                    let itemAlta = {
                        partido: row.substring(0, 3).trim(),
                        partida: row.substring(3, 9).trim(),
                        digitoVerificador: row.substring(9, 10).trim(),
                        circunscripcion: row.substring(10, 12).trim(),
                        seccion: row.substring(12, 14).trim(),
                        chacra: row.substring(14, 18).trim(),
                        letraChacra: row.substring(18, 21).trim(),
                        letraQuinta: row.substring(21, 25).trim(),
                        quinta: row.substring(25, 28).trim(),
                        fraccion: row.substring(28, 32).trim(),
                        letraFraccion: row.substring(32, 35).trim(),
                        manzana: row.substring(35, 39).trim(),
                        letraManzana: row.substring(39, 42).trim(),
                        parcela: row.substring(42, 46).trim(),
                        letraParcela: row.substring(46, 49).trim(),
                        subparcela: row.substring(49, 55).trim(),
                        destinatario: row.substring(55, 88).trim(),
                        calle: row.substring(88, 133).trim(),
                        barrio: row.substring(133, 163).trim(),
                        altura: row.substring(163, 168).trim(),
                        puerta: row.substring(168, 171).trim(),
                        piso: row.substring(171, 174).trim(),
                        departamento: row.substring(174, 178).trim(),
                        codigoPostal: row.substring(178, 182).trim(),
                        codigoPostalArgentina: row.substring(182, 190).trim(),
                        localidad: row.substring(190, 220).trim(),
                        fechaActividadVigente: row.substring(220, 228).trim(),
                        vigencia: moment(row.substring(220, 228).trim(), "YYYYMMDD").toDate(),
                        caracteristica: row.substring(228, 229).trim(),
                        superficie: parseFloat(row.substring(229, 238).trim()),
                        valorTierraHistoricoEntero: parseInt(row.substring(238, 247).trim()),
                        valorTierraHistoricoDecimales: parseInt(row.substring(247, 251).trim()),
                        valor1998: parseFloat(`${row.substring(238, 247).trim()}.${row.substring(247, 251).trim()}`),
                        valorTierraVigenteEntero: parseInt(row.substring(251, 260).trim()),
                        valorTierraVigenteDecimales: parseInt(row.substring(260, 264).trim()),
                        valorTierra: parseFloat(`${row.substring(251, 260).trim()}.${row.substring(260, 264).trim()}`),
                        valorEdificadoHistoricoEntero: parseInt(row.substring(264, 273).trim()),
                        valorEdificadoHistoricoDecimales: parseInt(row.substring(273, 277).trim()),
                        edif1997: parseFloat(`${row.substring(264, 273).trim()}.${row.substring(273, 277).trim()}`),
                        valorEdificadoVigenteEntero: parseInt(row.substring(277, 286).trim()),
                        valorEdificadoVigenteDecimales: parseInt(row.substring(286, 290).trim()),
                        valorEdificado: parseFloat(`${row.substring(277, 286).trim()}.${row.substring(286, 290).trim()}`),
                        motivoMovimiento: row.substring(290, 291).trim(),
                        origen: row.substring(291, 300).trim(),
                        titular: row.substring(300, 320).trim(),
                        codigoTitular: row.substring(320, 322).trim(),
                        dominioOrigen: row.substring(322, 325).trim(),
                        dominioInscripcion: row.substring(325, 331).trim(),
                        dominioTipo: row.substring(331, 332).trim(),
                        unidadesFuncionales: row.substring(332, 338).trim(),
                        dominioAnio: row.substring(338, 342).trim(),
                        serie: row.substring(342, 343).trim(),
                        superficieEdificada: parseFloat(row.substring(343, 352).trim()),
                        cuitResponsable1: row.substring(352, 363).trim(),
                        nombreYApellidoResponsable1: row.substring(363, 443).trim(),
                        tipoResponsable1: row.substring(443, 463).trim(),
                        cuitResponsable2: row.substring(463, 474).trim(),
                        nombreYApellidoResponsable2: row.substring(474, 554).trim(),
                        tipoResponsable2: row.substring(554, 574).trim()
                    }
                    alta.push(itemAlta);
                }

                const pathFileTarget = `${config.PATH.IMPORTS}${path}`;
                ensureDirectoryExistence(pathFileTarget);
                fs.rename(pathFileSource, pathFileTarget, (err) => {
                    if (err) {
                        reject(new ProcessError('Error moviendo archivo', err));
                        return;
                    }
                });

                await this.executeAlta(alta, idUsuario);

                resolve({ path });
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }

    async executeAlta(alta, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");

                for (let i = 0; i < alta.length; i++) {
                    try {
                        const itemAlta = alta[i];

                        const partido = parseInt(itemAlta.partido.toString().trim());
                        const partida = parseInt(itemAlta.partida.toString().trim());

                        itemAlta.partido = partido.toString();
                        itemAlta.partida = partida.toString();

                        const catastroExistente = await this.catastroService.getByPartida(token, itemAlta.partido, itemAlta.partida) as Catastro;
                        let catastro = new Catastro();

                        catastro.partida = itemAlta.partida;
                        catastro.partido = itemAlta.partido;
                        catastro.digitoVerificador = itemAlta.digitoVerificador;
                        catastro.circunscripcion = itemAlta.circunscripcion;
                        catastro.seccion = itemAlta.seccion;
                        catastro.chacra = itemAlta.chacra;
                        catastro.partido = itemAlta.partido;
                        catastro.letraChacra = itemAlta.letraChacra;
                        catastro.quinta = itemAlta.quinta;
                        catastro.letraQuinta = itemAlta.letraQuinta;
                        catastro.fraccion = itemAlta.fraccion;
                        catastro.letraFraccion = itemAlta.letraFraccion;
                        catastro.manzana = itemAlta.manzana;
                        catastro.letraManzana = itemAlta.letraManzana;
                        catastro.parcela = itemAlta.parcela;
                        catastro.letraParcela = itemAlta.letraParcela;
                        catastro.subparcela = itemAlta.subparcela;
                        catastro.destinatario = itemAlta.destinatario;
                        catastro.calle = itemAlta.calle;
                        catastro.altura = itemAlta.altura;
                        catastro.piso = itemAlta.piso;
                        catastro.departamento = itemAlta.departamento;
                        catastro.barrio = itemAlta.barrio;
                        catastro.localidad = itemAlta.localidad;
                        catastro.codigoPostal = itemAlta.codigoPostal;
                        catastro.vigencia = itemAlta.vigencia;
                        catastro.codigoPostalArgentina = itemAlta.codigoPostalArgentina;
                        catastro.superficie = itemAlta.superficie;
                        catastro.caracteristica = itemAlta.caracteristica;
                        catastro.valorTierra = itemAlta.valorTierra;
                        catastro.origen = itemAlta.origen;
                        catastro.motivoMovimiento = itemAlta.motivoMovimiento;
                        catastro.titular = itemAlta.titular;
                        catastro.letraParcela = itemAlta.letraParcela;
                        catastro.codigoTitular = itemAlta.codigoTitular;
                        catastro.dominioInscripcion = itemAlta.dominioInscripcion;
                        catastro.entreCalle1 = '';
                        catastro.entreCalle2 = '';
                        catastro.dominioOrigen = itemAlta.dominioOrigen;
                        catastro.dominioTipo = itemAlta.dominioTipo;
                        catastro.dominioAnio = itemAlta.dominioAnio;
                        catastro.unidadesFuncionales = itemAlta.unidadesFuncionales;
                        catastro.serie = itemAlta.serie;
                        catastro.cuitResponsable1 = itemAlta.cuitResponsable1;
                        catastro.nombreYApellidoResponsable1 = itemAlta.nombreYApellidoResponsable1;
                        catastro.tipoResponsable1 = itemAlta.tipoResponsable1;
                        catastro.cuitResponsable2 = itemAlta.cuitResponsable2;
                        catastro.nombreYApellidoResponsable2 = itemAlta.nombreYApellidoResponsable2;
                        catastro.tipoResponsable2 = itemAlta.tipoResponsable2;
                        catastro.catastralCodigo = '';


                        if (catastroExistente.id > 0) {
                            catastro.id = catastroExistente.id 
                            await this.catastroService.modifyByPartida(token, catastro.partido, catastro.partida, catastro);
                            
                        }
                        else {
                            await this.catastroService.add(token, catastro) as Catastro;
                        }
                    }
                    catch (error) {
                        const data = {
                            token: token,
                            idTipoAlerta: 30,
                            idUsuario: idUsuario,
                            fecha: getDateNow(true),
                            idModulo: 30,
                            origen: `${this.IMPORT_ARBA_RABBIT_QUEUE}/executeAlta`,
                            mensaje: "Error Importación ARBA CATASTRO",
                            data: {
                                alta: alta[i],
                                error: castPublicError(error),
                                message: "Error al procesar el alta"
                            }
                        };
                        await this.publishService.sendMessage(`${this.IMPORT_ARBA_RABBIT_QUEUE}/executeAlta`, "AddAlerta", "0", data);
                    }
                }

                resolve({});
            }
            catch (error) {
                reject(new ProcessError('Error procesando importacion', error));
            }
        });
    }
    
}