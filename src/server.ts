import swaggerUI from 'swagger-ui-express'
import swaggerSpec, { swaggerUIOptions } from './config/swagger';
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import express, { Router } from "express";
import morgan from 'morgan';


interface Options {
    port?: number
    router: Router
    corsConfig: CorsOptions
}

export class Server {
    private readonly server = express()
    private readonly port: number;
    private readonly router: Router;
    private readonly corsConfig: CorsOptions

    constructor(options: Options) {
        const { port = 4000, router, corsConfig } = options
        this.port = port
        this.router = router
        this.corsConfig = corsConfig

    }

    starApp() {
        this.server.use(cors(this.corsConfig))
        this.server.use(express.json())
        this.server.use(morgan('dev'))
        
        this.server.use('/api/products', this.router)

        //Docs
        this.server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUIOptions))


        this.server.listen(this.port, () => {
            console.log(colors.cyan.bold(`Res api en el pueto ${this.port}`))
        })
    }


}