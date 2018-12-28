export interface DBConfig {
    url: string
    port: number
    user: string
    password: string
    db: string
}


export interface RedisConfig {
    url: string
    port: number
}

export interface FrontendConfig {
    port: number
}

export interface RiotApiConfig {
    apiKey: string,
    rateLimits: RateLimit[]
}

export interface RateLimit {
    requests: number
    timeInterval: number
}
export interface Config {
    db: DBConfig
    redis: RedisConfig
    frontend: FrontendConfig
    riotApi: RiotApiConfig
}

export function loadConfigFromEnvironment(): Config {
    return {
        "db": {
            "url": process.env.DB_URL || "server_postgres_1",
            "port": parseInt(process.env.DB_PORT || "5432"),
            "user": process.env.DB_USER || "dev",
            "password": process.env.DB_PASSWORD || "dev",
            "db": process.env.DB_DB || "achievements"
        },
        "redis": {
            "url": process.env.REDIS_URL || "localhost",
            "port": parseInt(process.env.REDIS_PORT || "6379")
        },
        "frontend": {
            "port": parseInt(process.env.FRONTEND_PORT || "3000")
        },
        "riotApi": {
            "apiKey": process.env.RIOT_API_KEY || "RGAPI-fa2efd91-c418-45d4-be44-48fb8c10f312", // TODO: Remove
            "rateLimits": [
                {
                    requests: 20,
                    timeInterval: 1
                },
                {
                    requests: 100,
                    timeInterval: 120
                }
            ]
        }
    }
}