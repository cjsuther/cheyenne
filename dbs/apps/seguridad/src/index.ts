import { AppDataSource } from "./data-source"

AppDataSource.initialize().then(async () => {
    console.log("Done!")

}).catch(error => console.log(error))
