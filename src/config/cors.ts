import { CorsOptions } from "cors";

interface Options {
    FRONTEND_URL: string
    argv_2: string
    argv_3: string
    SWAGGER_URL: string
    NODE_ENV: string
}

export class CorsConfig {
    public corsOptions: CorsOptions;

    constructor(options: Options) {
        const { FRONTEND_URL, argv_2, argv_3, SWAGGER_URL, NODE_ENV } = options
        this.corsOptions = {
            origin: function (origin, callback) {
                const whitelist: Array<string | undefined> = [FRONTEND_URL]
                if (argv_2 === '--api' || NODE_ENV === 'test') {
                    whitelist.push(undefined)
                }

                if (argv_3 === '--docs') {
                    whitelist.push(SWAGGER_URL)
                }

                if (whitelist.includes(origin)) {
                    callback(null, true)
                } else {
                    callback(new Error('No permitido por CORS'))
                }
            }
        }
    }

}