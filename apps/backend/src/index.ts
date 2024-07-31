import fs from "node:fs";
import path from "node:path";
import Cors from "cors";
import Express, {type Request, type Response} from "express";
import bodyParser from "body-parser";
import session from "express-session";


//Init server
const app = Express()
//Port
const port = 3001; //TODO
//CORS Middleware
app.use(Cors({credentials: true}));
app.use(bodyParser.json());

interface CreateRequestBody {
    isDirectory?: boolean;
    content?: string;
}


app.use(session({
    name: "mainSession",
    secret: "secretimportantchangeme",
    resave: true,
    saveUninitialized: true,
    rolling: true,
    store: new session.MemoryStore(),
    cookie: {
        secure: process.env["NODE_ENV"] === 'production',
        maxAge: 2 * 60 * 60 * 1000, //2 Hours
    }
}));

const baseDir = "/tmp/nfs";

fs.mkdirSync(baseDir, {recursive: true});

app.get('/api/v1/root/*', (req: Request, res: Response) => {
    try {

        const reqPath = req.params[0] ?? '';
        const fullPath = path.join(baseDir, reqPath);

        const statResult = fs.statSync(fullPath)

        if (statResult.isDirectory()) {
            const contents = fs.readdirSync(fullPath)

            return res.status(200).json({
                isSuccessful: true,
                message: "Directory Returned",
                data: contents
            });
        }

        if (statResult.isFile()) {
            const contents: Buffer = fs.readFileSync(fullPath)

            return res.status(200).json({
                isSuccessful: true,
                message: "File Returned",
                data: contents
            });
        }

        return res.status(404).json({
            isSuccessful: false,
            message: "Not a File or Dir",
        });

    } catch (e: unknown) {
        return res.status(404).json({
            isSuccessful: false,
            message: "Not a File or Dir",
        });
    }
});


app.delete("/api/v1/root/*", (req: Request, res: Response) => {
    try {
        const reqPath = req.params[0] ?? '';
        const fullPath = path.join(baseDir, reqPath);

        const statResult = fs.statSync(fullPath)
        const isDir = statResult.isDirectory()

        // if (isDir || statResult.isFile()) {
        fs.rmSync(fullPath, {recursive: true, force: true})

        return res.status(200).json({
            isSuccessful: true,
            message: isDir ?
                "Directory Removed" :
                "File Removed",
        });
    } catch (e: unknown) {
        return res.status(404).json({
            isSuccessful: false,
            message: "Not a File or Dir",
        });
    }
});

//TODO it does not fail if file/dir already exists
app.post("/api/v1/root/*", (req: Request, res: Response) => {
    try {
        const reqPath = req.params[0] ?? '';
        const fullPath = path.join(baseDir, reqPath);
        const {isDirectory, content} = req.body as CreateRequestBody;

        if (isDirectory === undefined) {
            return res.status(500).json({
                isSuccessful: false,
                message: "Not enough information provided",
            });
        }

        console.log("IS dir: " + isDirectory);
        if (isDirectory) {
            fs.mkdirSync(fullPath, {recursive: true});
            return res.status(201).json({
                isSuccessful: true,
                message: "Directory Created",
            });
        }

        console.log("writing file instead");

        fs.writeFileSync(fullPath, content ?? "");
        return res.status(201).json({
            isSuccessful: true,
            message: "File Created",
        });
    } catch (e: unknown) {
        return res.status(500).json({
            isSuccessful: false,
            message: "Failed to create file or directory",
        });
    }
});


app.listen(port, () => {
    console.log(`LokuBox Backend listening on port ${port}`);
});