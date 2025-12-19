export default class RecaudacionRow {

    idRecaudadora: number;
    casos: number;
    importeTotal: number;
    
    constructor(idRecaudadora: number=0, casos: number=0, importeTotal: number=0)
    {
        this.idRecaudadora = idRecaudadora;
        this.casos = casos;
        this.importeTotal = importeTotal;
    }
    
}
