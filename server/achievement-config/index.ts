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
    platform: string
}

export interface Config {
    db: DBConfig
    redis: RedisConfig
    frontend: FrontendConfig
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
            "port": parseInt(process.env.FRONTEND_PORT || "3000"),
            "platform": process.env.FRONTEND_PLATFORM || "euw1"
        }
    }
}