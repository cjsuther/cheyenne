import cron from "node-cron";
import config from "./config";

let token = null;
const domian = config.DOMAIN;
const interval = config.INTERVAL;

const headers = { 
  "Content-Type": "application/json",
  "Origin": domian
}

const login = () => {
  return new Promise( async (resolve, reject) => {
    try {

      const dataBody = {
        "username": config.ACCESS.USR,
        "password": config.ACCESS.PSW
      }
      const options = {
        method: "POST",
        headers: headers,
        body: (dataBody) ? JSON.stringify(dataBody) : null
      };
      const url = config.SITE.WEBAPI_SEGURIDAD + 'api/login';

      fetch(url, options)
      .then((response) => {
          if (response.ok)
              response.text().then(resolve).catch(reject);
          else
              response.text().then(reject).catch(reject);
      })
      .catch(reject);

    }
    catch(error) {
        reject(error);
    }

  });
}

const verify = () => {
  return new Promise( async (resolve, reject) => {
    try {

      const options = {
        method: "GET",
        headers: headers
      };
      const url = config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/proceso/verify/' + token;

      fetch(url, options)
      .then((response) => {
          if (response.ok)
              response.json().then(resolve).catch(reject);
          else
              response.json().then(reject).catch(reject);
      })
      .catch(reject);

    }
    catch(error) {
        reject(error);
    }

  });
}

const execute = async () => {
  try {
    if (!token) {
      token = await login();
    }
    verify()
    .then(console.log)
    .catch(error => {
      if (error.message === "Unauthorized") {
        login()
        .then(response => token = response)
        .catch(error => console.log(error))
      }
    })
  }
  catch(error) {
      console.log(error);
  }
}

cron.schedule(`*/${interval} * * * * *`, () => {
  const date = new Date();
  console.log(`-Process runs at ${date}`);
  execute();
});
