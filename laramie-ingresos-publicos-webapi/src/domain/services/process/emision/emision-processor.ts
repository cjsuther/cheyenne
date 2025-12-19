import EmisionResource from './emision-resource';

export default class EmisionProcessor {

    ready: boolean;
    name: string;

    constructor(name:string) {
        this.ready = true;
        this.name = name;
    }

    async doProcess(emisionResource:EmisionResource): Promise<EmisionResource> {
        return null;
    }

}
