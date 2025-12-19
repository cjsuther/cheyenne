"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = __importDefault(require("./config"));
let token = null;
const domian = config_1.default.DOMAIN;
const interval = config_1.default.INTERVAL;
const headers = {
    "Content-Type": "application/json",
    "Origin": domian
};
const login = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dataBody = {
                "username": config_1.default.ACCESS.USR,
                "password": config_1.default.ACCESS.PSW
            };
            const options = {
                method: "POST",
                headers: headers,
                body: (dataBody) ? JSON.stringify(dataBody) : null
            };
            const url = config_1.default.SITE.WEBAPI_SEGURIDAD + 'api/login';
            fetch(url, options)
                .then((response) => {
                if (response.ok)
                    response.text().then(resolve).catch(reject);
                else
                    response.text().then(reject).catch(reject);
            })
                .catch(reject);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const verify = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const options = {
                method: "GET",
                headers: headers
            };
            const url = config_1.default.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/proceso/verify/' + token;
            fetch(url, options)
                .then((response) => {
                if (response.ok)
                    response.json().then(resolve).catch(reject);
                else
                    response.json().then(reject).catch(reject);
            })
                .catch(reject);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const execute = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!token) {
            token = yield login();
        }
        verify()
            .then(console.log)
            .catch(error => {
            if (error.message === "Unauthorized") {
                login()
                    .then(response => token = response)
                    .catch(error => console.log(error));
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
node_cron_1.default.schedule(`*/${interval} * * * * *`, () => {
    const date = new Date();
    console.log(`-Process runs at ${date}`);
    execute();
});
//# sourceMappingURL=app.js.map