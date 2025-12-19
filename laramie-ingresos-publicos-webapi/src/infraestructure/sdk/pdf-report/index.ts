import { HtmlReport, ReportOptions } from "nodejs-pdf-report";

export default class PdfReport {

    name: string;
    pathBase: string;
    options: any;

    constructor(
        _name: string = "",
        _pathBase: string = "",
        _options: any = {})
    {
        const optionsDefault = {
            landscape: false,
            formatPage: "A4",
            margin: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            title: '',
            pathBodyTemplate: null,
            pathHeaderTemplate: null,
            pathFooterTemplate: null,
            pathStyles: [],
            pathImages: [],
            data: {}
        };

        this.name = _name;
        this.pathBase = _pathBase;
        // this.options = Object.assign(optionsDefault, _options);
        this.options = {...optionsDefault, ..._options};
    }

    async generate() {
        return new Promise( async (resolve, reject) => {
            try {
                const marginBase = {
                    // top: (this.options.pathHeaderTemplate !== null) ? 40 : 0,
                    // bottom: (this.options.pathFooterTemplate !== null) ? 35 : 0,
                    top: 0,
                    bottom: 0,
                };
                const reportOptions: ReportOptions = {
                    title: this.options.title,
                    useChartJs: true,
                    pdfOptions: {
                        scale: 1,
                        printBackground: true,
                        displayHeaderFooter: (this.options.pathHeaderTemplate !== null || this.options.pathFooterTemplate !== null),
                        landscape: this.options.landscape,
                        format: this.options.formatPage,
                        margin: {
                            top: `${marginBase.top + this.options.margin.top}px`,
                            bottom: `${marginBase.bottom + this.options.margin.bottom}px`,
                            right: `${this.options.margin.right}px`,
                            left: `${this.options.margin.left}px`,
                        },
                    },
                    template: this.options.pathBodyTemplate,
                    headerTemplate: (this.options.pathHeaderTemplate) ? this.options.pathHeaderTemplate : this.pathBase + "/empty-html.ejs",
                    footerTemplate: (this.options.pathFooterTemplate) ? this.options.pathFooterTemplate : this.pathBase + "/empty-html.ejs",
                    styles: this.options.pathStyles,
                    scripts: [],
                    data: this.options.data
                };

                const htmlReport = new HtmlReport();
                const buffer = await htmlReport.createPdf(reportOptions);

                resolve(buffer);
            }
            catch(error) {
                reject(error);
            }
        });
    }
    
}
