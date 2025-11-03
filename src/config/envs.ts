
import { get } from 'env-var';
import path from 'node:path'

process.loadEnvFile(path.resolve(process.cwd(), '.env'))


export const envs = {
    PORT: get('PORT').required().asInt(),
    DATABASE_URL: get('DATABASE_URL').required().asString(),
    FRONTEND_URL: get('FRONTEND_URL').required().asString(),

    ARGV_2: process.argv[2] ?? '',
    ARGV_3: process.argv[3] ?? '',
    SWAGGER_URL: process.argv[3] ? get('SWAGGER_URL').required().asString() : '',
    NODE_ENV: process.env.NODE_ENV ?? '',
}