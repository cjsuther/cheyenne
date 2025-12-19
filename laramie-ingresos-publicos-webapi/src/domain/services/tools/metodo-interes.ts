export interface IMetodoInteres {

	getImporteCuota();

	getImporteInteresCuota(numeroCuota);

	getImporteCapitalCuota(numeroCuota);

	getImporteCapitalAcumulado(numeroCuota);

	getImporteInteresTotal();

}

export class MetodoFrances implements IMetodoInteres {

	private Co:number = 0.00;
	private i:number = 0.00;
	private n:number = 0;

	constructor(importeCapitalOriginal:number, porcentajeInteres:number, cantidadCuotas:number) {
		this.Co = importeCapitalOriginal;
		this.i = porcentajeInteres / 100;
		this.n = cantidadCuotas;
	}

	private getImporteValores(numeroCuota) {
		let result = {};

		const a:number = this.getImporteCuota();
		let Ik = 0; //importe interes cuota
		let Ak = 0; //importe capital cuota
		let Ak_1 = 0;
		let Ck = 0; //importe capital acum
		let Ck_1 = 0;
		let mk = 0; //importe capital adeudado
		let mk_1 = this.Co;

		for (let k=1; k <= numeroCuota; k++) {

			Ik = mk_1 * this.i;
			Ak = a - Ik;
			Ck = Ck_1 + Ak;
			mk = mk_1 - Ak;

			mk_1 = mk;
			Ck_1 = Ck;
			Ak_1 = Ak;

			if (k === numeroCuota) {
				result = {
					Ik: Ik,
					Ak: Ak,
					Ck: Ck,
					mk: mk
				};
				break;
			}
		}

		return result;
	}

	getImporteCuota() {
		const coe:number = Math.pow((1 + this.i), this.n);
		const a:number = (coe * this.i) / (coe - 1) * this.Co;

		return a;
	}

	getImporteInteresCuota(numeroCuota) {
		return this.getImporteValores(numeroCuota)["Ik"];
	}

	getImporteCapitalCuota(numeroCuota) {
		return this.getImporteValores(numeroCuota)["Ak"];
	}

	getImporteCapitalAcumulado(numeroCuota) {
		return this.getImporteValores(numeroCuota)["Ck"];
	}

	getImporteInteresTotal() {
		let I:number = 0;
		for (let k=1; k <= this.n; k++) {
			I += this.getImporteInteresCuota(k);
		}
		return  I;
	}

}

export class MetodoSimple implements IMetodoInteres {

	private Co:number = 0.00;
	private i:number = 0.00;
	private n:number = 0;

	constructor(importeCapitalOriginal:number, porcentajeInteres:number, cantidadCuotas:number) {
		this.Co = importeCapitalOriginal;
		this.i = porcentajeInteres / 100;
		this.n = cantidadCuotas;
	}

	private getImporteValores(numeroCuota) {
		let result = {};

		const a:number = this.getImporteCuota();
		let Ik = 0; //importe interes cuota
		let Ak = 0; //importe capital cuota
		let Ak_1 = 0;
		let Ck = 0; //importe capital acum
		let Ck_1 = 0;
		let mk = 0; //importe capital adeudado
		let mk_1 = this.Co;

		for (let k=1; k <= numeroCuota; k++) {

			Ik = a * this.i;
			Ak = a - Ik;
			Ck = Ck_1 + Ak;
			mk = mk_1 - Ak;

			mk_1 = mk;
			Ck_1 = Ck;
			Ak_1 = Ak;

			if (k === numeroCuota) {
				result = {
					Ik: Ik,
					Ak: Ak,
					Ck: Ck,
					mk: mk
				};
				break;
			}
		}

		return result;
	}

	getImporteCuota() {
		const coe:number = Math.pow((1 + this.i), this.n);
		const a:number = (coe * this.i) / (coe - 1) * this.Co;

		return a;
	}

	getImporteInteresCuota(numeroCuota) {
		return this.getImporteValores(numeroCuota)["Ik"];
	}

	getImporteCapitalCuota(numeroCuota) {
		return this.getImporteValores(numeroCuota)["Ak"];
	}

	getImporteCapitalAcumulado(numeroCuota) {
		return this.getImporteValores(numeroCuota)["Ck"];
	}

	getImporteInteresTotal() {
		let I:number = 0;
		for (let k=1; k <= this.n; k++) {
			I += this.getImporteInteresCuota(k);
		}
		return  I;
	}

}