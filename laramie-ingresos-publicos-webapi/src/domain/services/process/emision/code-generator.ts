import Funcion from '../../../entities/funcion';
import ProcedimientoParametro from '../../../entities/procedimiento-parametro';
import EmisionCalculo from "../../../entities/emision-calculo";
import EmisionConcepto from '../../../entities/emision-concepto';
import EmisionCuentaCorriente from '../../../entities/emision-cuenta-corriente';
import EmisionImputacionContable from '../../../entities/emision-imputacion-contable';
import FuncionService from '../../funcion-service';
import ProcedimientoParametroService from '../../procedimiento-parametro-service';
import EmisionCalculoService from "../../emision-calculo-service";
import EmisionConceptoService from '../../emision-concepto-service';
import EmisionCuentaCorrienteService from '../../emision-cuenta-corriente-service';
import EmisionImputacionContableService from '../../emision-imputacion-contable-service';

import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import { CloneObject } from '../../../../infraestructure/sdk/utils/helper';



export default class CodeGenerator {

    private funcionService: FuncionService;
    private emisionCalculoService: EmisionCalculoService;
    private emisionConceptoService: EmisionConceptoService;
    private emisionCuentaCorrienteService: EmisionCuentaCorrienteService;
    private emisionImputacionContableService: EmisionImputacionContableService;
    private funciones: Array<Funcion>;
    private calculos: Array<EmisionCalculo>;
    private conceptos: Array<EmisionConcepto>;
    private cuentasCorrientes: Array<EmisionCuentaCorriente>;
    private imputacionesContables: Array<EmisionImputacionContable>;


    constructor(funcionService: FuncionService,
                emisionCalculoService: EmisionCalculoService,
                emisionConceptoService: EmisionConceptoService,
                emisionCuentaCorrienteService: EmisionCuentaCorrienteService,
                emisionImputacionContableService: EmisionImputacionContableService) {
        this.funcionService = funcionService;
        this.emisionCalculoService = emisionCalculoService;
        this.emisionConceptoService = emisionConceptoService;
        this.emisionCuentaCorrienteService = emisionCuentaCorrienteService;
        this.emisionImputacionContableService = emisionImputacionContableService;
        this.funciones = null;
        this.calculos = null;
        this.conceptos = null;
        this.cuentasCorrientes = null;
        this.imputacionesContables = null;
    }


    async generateModule(idEmisionDefinicion:number) {
        return new Promise( async (resolve, reject) => {
            try {
                if (!this.funciones) {
                    this.funciones = await this.funcionService.list() as Array<Funcion>;
                }
                if (!this.calculos) {
                    this.calculos = (await this.emisionCalculoService.listByEmisionDefinicion(idEmisionDefinicion) as Array<EmisionCalculo>).sort((a, b) => a.orden - b.orden);
                }
                if (!this.conceptos) {
                    this.conceptos = (await this.emisionConceptoService.listByEmisionDefinicion(idEmisionDefinicion) as Array<EmisionConcepto>).sort((a, b) => a.orden - b.orden);
                }
                if (!this.cuentasCorrientes) {
                    this.cuentasCorrientes = (await this.emisionCuentaCorrienteService.listByEmisionDefinicion(idEmisionDefinicion) as Array<EmisionCuentaCorriente>).sort((a, b) => a.orden - b.orden);
                }
                if (!this.imputacionesContables) {
                    this.imputacionesContables = (await this.emisionImputacionContableService.listByEmisionDefinicion(idEmisionDefinicion) as Array<EmisionImputacionContable>).sort((a, b) => a.orden - b.orden);
                }

                let code = `Object.defineProperty(exports, "__esModule", { value: true });\r\n\r\n`;

                code += "class EmisionProcess {\r\n\r\n";
                code += `\tfunciones;\r\n`;
                code += `\tvariables;\r\n`;
                code += `\telementos;\r\n`;
                code += `\tentidades;\r\n`;
                code += `\tparametros;\r\n`;
                code += `\tresults;\r\n\r\n`;

                code += `\tconstructor(parametros) {\r\n`;
                code += `\t\tthis.funciones = {};\r\n`;
                code += `\t\tthis.variables = {};\r\n`;
                code += `\t\tthis.elementos = {};\r\n`;
                code += `\t\tthis.entidades = {};\r\n`;
                code += `\t\tthis.parametros = parametros;\r\n`;
                code += `\t\tthis.results = {};\r\n`;
                code += `\t}\r\n\r\n`;

                let functionsCalculo = "";
                let functionDefault = `\tasync getResults(funciones, variables, elementos, entidades) {\r\n`;
                functionDefault += `\t\treturn new Promise( async (resolve, reject) => {\r\n`;
                functionDefault += `\t\t\tlet stepName = "";\r\n`;
                functionDefault += `\t\t\ttry {\r\n`;
                functionDefault += `\t\t\t\tthis.funciones = funciones;\r\n`;
                functionDefault += `\t\t\t\tthis.variables = variables;\r\n`;
                functionDefault += `\t\t\t\tthis.elementos = elementos;\r\n`;
                functionDefault += `\t\t\t\tthis.entidades = entidades;\r\n`;
               
                this.calculos.forEach((calculo) => {
                    const functionCalculo = this.generateFunction(calculo.codigo, calculo.formula);
                    functionsCalculo += `${functionCalculo}\r\n`;
                    functionDefault += `\t\t\t\tstepName = "${calculo.codigo}";\r\n`;
                    functionDefault += `\t\t\t\tthis.results["${calculo.codigo}"] = this.f${calculo.codigo}();\r\n`;
                });
                
                let codigoConcepto = "";
                let functionConcepto = "";
                this.conceptos.forEach((concepto) => {
                    codigoConcepto = `CONCEPTO_CONDICION_${concepto.orden}`;
                    functionConcepto = this.generateFunction(codigoConcepto, concepto.formulaCondicion);
                    functionsCalculo += `${functionConcepto}\r\n`;
                    functionDefault += `\t\t\t\tstepName = "${codigoConcepto}";\r\n`;
                    functionDefault += `\t\t\t\tthis.results["${codigoConcepto}"] = this.f${codigoConcepto}();\r\n`;

                    codigoConcepto = `CONCEPTO_IMPORTE_TOTAL_${concepto.orden}`;
                    functionConcepto = this.generateFunction(codigoConcepto, concepto.formulaImporteTotal);
                    functionsCalculo += `${functionConcepto}\r\n`;
                    functionDefault += `\t\t\t\tstepName = "${codigoConcepto}";\r\n`;
                    functionDefault += `\t\t\t\tthis.results["${codigoConcepto}"] = this.f${codigoConcepto}();\r\n`;

                    codigoConcepto = `CONCEPTO_IMPORTE_NETO_${concepto.orden}`;
                    functionConcepto = this.generateFunction(codigoConcepto, concepto.formulaImporteNeto);
                    functionsCalculo += `${functionConcepto}\r\n`;
                    functionDefault += `\t\t\t\tstepName = "${codigoConcepto}";\r\n`;
                    functionDefault += `\t\t\t\tthis.results["${codigoConcepto}"] = this.f${codigoConcepto}();\r\n`;
                });

                let codigoCuentaCorriente = "";
                let functionCuentaCorriente = "";
                this.cuentasCorrientes.forEach((cuentaCorriente) => {
                    codigoCuentaCorriente = `CUENTA_CORRIENTE_CONDICION_${cuentaCorriente.orden}`;
                    functionCuentaCorriente = this.generateFunction(codigoCuentaCorriente, cuentaCorriente.formulaCondicion);
                    functionsCalculo += `${functionCuentaCorriente}\r\n`;
                    functionDefault += `\t\t\t\tstepName = "${codigoCuentaCorriente}";\r\n`;
                    functionDefault += `\t\t\t\tthis.results["${codigoCuentaCorriente}"] = this.f${codigoCuentaCorriente}();\r\n`;

                    codigoCuentaCorriente = `CUENTA_CORRIENTE_DEBE_${cuentaCorriente.orden}`;
                    functionCuentaCorriente = this.generateFunction(codigoCuentaCorriente, cuentaCorriente.formulaDebe);
                    functionsCalculo += `${functionCuentaCorriente}\r\n`;
                    functionDefault += `\t\t\t\tstepName = "${codigoCuentaCorriente}";\r\n`;
                    functionDefault += `\t\t\t\tthis.results["${codigoCuentaCorriente}"] = this.f${codigoCuentaCorriente}();\r\n`;

                    codigoCuentaCorriente = `CUENTA_CORRIENTE_HABER_${cuentaCorriente.orden}`;
                    functionCuentaCorriente = this.generateFunction(codigoCuentaCorriente, cuentaCorriente.formulaHaber);
                    functionsCalculo += `${functionCuentaCorriente}\r\n`;
                    functionDefault += `\t\t\t\tstepName = "${codigoCuentaCorriente}";\r\n`;
                    functionDefault += `\t\t\t\tthis.results["${codigoCuentaCorriente}"] = this.f${codigoCuentaCorriente}();\r\n`;
                });

                let codigoImputacionContable = "";
                let functionImputacionContable = "";
                this.imputacionesContables.forEach((imputacionContable) => {
                    codigoImputacionContable = `IMPUTACION_CONTABLE_CONDICION_${imputacionContable.orden}`;
                    functionImputacionContable = this.generateFunction(codigoImputacionContable, imputacionContable.formulaCondicion);
                    functionsCalculo += `${functionImputacionContable}\r\n`;
                    functionDefault += `\t\t\t\tstepName = "${codigoImputacionContable}";\r\n`;
                    functionDefault += `\t\t\t\tthis.results["${codigoImputacionContable}"] = this.f${codigoImputacionContable}();\r\n`;

                    codigoImputacionContable = `IMPUTACION_CONTABLE_PORCENTAJE_${imputacionContable.orden}`;
                    functionImputacionContable = this.generateFunction(codigoImputacionContable, imputacionContable.formulaPorcentaje);
                    functionsCalculo += `${functionImputacionContable}\r\n`;
                    functionDefault += `\t\t\t\tstepName = "${codigoImputacionContable}";\r\n`;
                    functionDefault += `\t\t\t\tthis.results["${codigoImputacionContable}"] = this.f${codigoImputacionContable}();\r\n`;
                });
        
                functionDefault += `\t\t\t\tconst data = Object.assign({}, this.results, {});\r\n`;
                functionDefault += `\t\t\t\tresolve(data);\r\n`;
                functionDefault += `\t\t\t}\r\n`;
                functionDefault += `\t\t\tcatch(error) {\r\n`;
                functionDefault += `\t\t\t\treject(\`Error generando cálculo \${stepName}: \${error.message}\`);\r\n`;
                functionDefault += `\t\t\t}\r\n`;
                functionDefault += `\t\t});\r\n`;
                functionDefault += `\t}\r\n\r\n`;
        
                code += functionsCalculo + functionDefault;
                code += `}\r\n\r\n`;
                code += `exports.default = EmisionProcess;\r\n`;

                resolve(code);
            }
            catch(error) {
                reject(new ProcessError('Error generando código', error));
            }
        });
    }

    private generateFunction(codigo:string, formula:string) {
        let code = `\tf${codigo}() {\r\n`;
        code += `\t\treturn (`;

        if (formula.length > 0) {
            const pieces = formula.replace(/\\n/g,'').replace(/\|\|/g, "|").split('|');
            code += this.generateCode(pieces);
        }
        else {
            code += "\"\"";
        }

        code += `)\r\n`;
        code += `\t}\r\n`;

        return code;
    }

    private generateCode(pieces) {
        const reservatedChar = ['+','-','*','/',',','(',')','>','<','='];
        let code = "";

        for (let i=0; i < pieces.length; i++) {
            let piece = pieces[i];
            piece = piece.trim();
            let pieceCode = "";
            if (reservatedChar.includes(piece[0])) { //caracter reservado del lenguaje
                code += piece.replace(/(?<![\>\<])\=/g,'==').replace(/\<\>/g, '!=').replace(/\+/g, '*1+1*').replace(/\s/g,'');
            }
            else if (piece.startsWith('@V')) { //variable
                code += `this.variables["${piece.substring(2)}"]`;
            }
            else if (piece.startsWith('@C')) { //calculo
                code += `this.results["${piece.substring(2)}"]`;
            }
            else if (piece.startsWith('@F')) { //funcion
                const funcion = this.funciones.find(f =>  f.codigo === piece.substring(2));
                code += `this.funciones["${funcion.modulo}"]`;
                if (pieces[++i] !== "(") {
                    throw new ValidationError('Función mal conformada');
                }
                code += "(";
                let parameter = [];
                let parameters = 0;
                let countOpen = 1;
                i++;
                while (countOpen > 0 && i < pieces.length) {
                    if (pieces[i] === "(") countOpen++;
                    else if (pieces[i] === ")") countOpen--;

                    if (countOpen === 0) {
                        if (parameter.length > 0) {
                            if (parameters > 0) code += ',';
                            if (funcion.funcionParametros.length > parameters &&
                                funcion.funcionParametros[parameters].tipoDato === "function") {
                                code += '(fields) => {return (' + this.generateCode(parameter) + ');}';
                            }
                            else {
                                code += this.generateCode(parameter);
                            }
                        }
                    }
                    else {
                        if (countOpen === 1 && pieces[i] === ",") {
                            if (parameter.length === 0) {
                                throw new ValidationError('Parámetro mal conformado');
                            }

                            if (parameters > 0) code += ',';
                            if (funcion.funcionParametros.length > parameters &&
                                funcion.funcionParametros[parameters].tipoDato === "function") {
                                code += '(fields) {return (' + this.generateCode(parameter) + ');}';
                            }
                            else {
                                code += this.generateCode(parameter);
                            }
                            parameters++;
                            parameter = [];
                        }
                        else parameter.push(pieces[i]);
                    }
                    i++;
                }
                //espero que se haya encontrado el ) de cierre
                if (countOpen > 0) {
                    throw new ValidationError('Función mal conformada');
                }
                code += ")";
                i--;
            }
            else if (piece.startsWith('@P')) { //parametros
                code += `this.parametros["${piece.substring(2)}"]`;
            }
            else if (piece.startsWith('@E')) { //elementos
                code += `this.elementos["${piece.substring(2)}"]??[]`;
            }
            else if (piece.startsWith('@T')) { //elementos
                code += `this.entidades["${piece.substring(2)}"]??[]`;
            }
            else if (piece.startsWith('@D')) { //fields
                code += `fields["${piece.substring(2)}"]`;
            }
            else { //constante
                code += piece;
            }
            code += pieceCode;
        }

        return code
    }

}