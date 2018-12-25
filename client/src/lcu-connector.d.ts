declare module 'lcu-connector' {

    interface ConnectionData {
        address: string
        port: number
        username: string
        password: string
        protocol: string
    }

    class LCUConnector {

        on(event: 'connect' | 'disconnect', cb: (data: ConnectionData | null) => void): void;
        start(): void
        stop(): void
    }
    export = LCUConnector
}
