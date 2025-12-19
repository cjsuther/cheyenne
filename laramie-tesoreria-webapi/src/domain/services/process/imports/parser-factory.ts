import IParser from "./i-parser";
import parserBanelco from "./parser-banelco";
import parserCucei from "./parser-cucei";
import parserLink from "./parser-link";
import parserMonotasa from "./parser-monotasa";
import parserBapro from "./parser-bapro";


export default class ParserFactory {

	getParser(codigoCliente:string): IParser
	{
		switch(codigoCliente) {
			case "1048": { //Banelco
				return this.getParser1048();
			}
			case "CUCEI": { //CUCEI
				return this.getParserCUCEI();
			}
			case "AU9": { //LINK
				return this.getParserAU9();
			}
			case "MONOTASA": { //LINK
				return this.getParserMonotasa();
			}
			case "BAPRO": { //BAPRO
				return this.getParserBapro();
			}
			default:
				return null;
		}
	}

	private getParser1048(): IParser
	{
		return new parserBanelco();
	}

	private getParserCUCEI(): IParser
	{
		return new parserCucei();
	}

	private getParserAU9(): IParser
	{
		return new parserLink();
	}

	private getParserMonotasa(): IParser
	{
		return new parserMonotasa();
	}

	private getParserBapro(): IParser
	{
		return new parserBapro();
	}

}
