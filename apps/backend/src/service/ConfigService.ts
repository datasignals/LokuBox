import * as fs from "node:fs";
import * as Path from "node:path";

export interface Config {
    port: number;
    nfsLocation: string;
    sessionSecret: string;
}


export class ConfigService {
    protected readonly configLocation: string = Path.join(
        Path.dirname(__dirname),
        "config",
    );
    protected readonly configName: string = "config.json";
    protected readonly configFullPath: string = Path.resolve(
        this.configLocation,
        this.configName,
    );

    private readonly defaultConfig: Config = {
        port: 3001,
        nfsLocation: "/tmp/nfs",
        sessionSecret: "!!changeme!!",
    };

    configExists(): boolean {
        return fs.existsSync(this.configFullPath);
    }

    getConfigOrDefault(): Config {
        try {
            const a = fs.readFileSync(this.configFullPath);
            if (a.toString().length <= 0) {
                return this.defaultConfig;
            }
            return JSON.parse(a.toString()) as Config;
        } catch (e: unknown) {
            return this.defaultConfig;
        }
    }

    getConfig(): Config | undefined {
        const a = fs.readFileSync(this.configFullPath);
        try {
            return JSON.parse(a.toString()) as Config
        } catch (e: unknown) {
            // console.error(`Failed to get config: ${e.toString()}`);
            return undefined;
        }
    }
}
