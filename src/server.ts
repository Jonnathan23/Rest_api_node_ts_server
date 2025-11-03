import swaggerUI from 'swagger-ui-express'
import swaggerSpec, { swaggerUIOptions } from './config/swagger';
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import express, { Router } from "express";
import morgan from 'morgan';
import type { Express } from 'express';


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
    private built = false

    constructor(options: Options) {
        const { port = 4000, router, corsConfig } = options
        this.port = port
        this.router = router
        this.corsConfig = corsConfig

    }

    private build(): Express {

        if (this.built) return this.server
        this.built = true

        this.server.use(cors(this.corsConfig))
        this.server.use(express.json())
        this.server.use(express.urlencoded({ extended: true }))
        this.server.use(morgan('dev'))

        this.server.use('/api/products', this.router)
        
        if (process.env.NODE_ENV !== 'test') {
            this.server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUIOptions))
        }

        return this.server
    }

    starApp() {
        const app = this.build()
        app.listen(this.port, () => {
            console.log(colors.cyan.bold(`Res api en el pueto ${this.port}`))
        })
    }

    get express(): Express {
        return this.build()
    }
}