
export class ProcessingService {


    public processGame(gameId: number, platform: string): Promise<void> {
        console.log("Processing game " + gameId + " on " + platform)
        return Promise.resolve();
    }
}