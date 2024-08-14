import fs from "node:fs";
import path from "node:path";
import Cors from "cors";
import Express, {type Request, type Response} from "express";
import bodyParser from "body-parser";
import session from "express-session";
import {mountNfs1, mountNfs2, unmountNfs} from "./Util";
import {FileDescription} from "@repo/common/Models";

//Init server
const app = Express();
//Port
const port = 3001; //TODO
//CORS Middleware
app.use(Cors({credentials: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

//TODO if this is to exists, it needs to be in common folder
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

const nfsDirectory = "/tmp/nfs";

fs.mkdirSync(nfsDirectory, {recursive: true});

app.get("/info", (_req, res) => {
    return res.status(200).send(nfsDirectory);
})

app.get("/mount", async (req, res) => {
    const path = req.query["path"]?.toString();

    if (path === "1" || path === "2") {
        await unmountNfs(nfsDirectory);

        console.log('mounting nfs...');

        path === "1" ?
            await mountNfs1(nfsDirectory) :
            await mountNfs2(nfsDirectory);

        return res
            .status(200)
            .send("NFS dir changed");
    }
    return res
        .status(404)
        .send("NFS dir does not exist");
});

app.get('/api/v1/root/*', (req: Request, res: Response) => {
    try {
        const reqPath = req.params[0] ?? '';
        const fullPath = path.join(nfsDirectory, reqPath);

        const statResult = fs.statSync(fullPath)

        if (statResult.isDirectory()) {
            const contents = fs.readdirSync(fullPath)

            const files: FileDescription[] = [];
            const directories: string[] = [];

            contents.forEach(node => {
                const nodeFullPath = path.join(fullPath, node);
                const stats = fs.lstatSync(nodeFullPath);

                if (stats.isFile()) {
                    console.log("nodeFullPath", nodeFullPath);
                    files.push({filename: node, creationDate: stats.birthtime.getTime()});
                } else if (stats.isDirectory()) {
                    directories.push(node);
                }
            });


            console.log(`readdirsync: ${JSON.stringify(contents, null, 2)}`);

            return res.status(200).json({
                isSuccessful: true,
                message: "Directory Returned",
                data: {
                    files,
                    directories
                }
            });
        }

        if (statResult.isFile()) {
            const contents: Buffer = fs.readFileSync(fullPath)

            return res.status(200).json({
                isSuccessful: true,
                message: "File Returned",
                data: contents.toString("base64")
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
        const fullPath = path.join(nfsDirectory, reqPath);

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
        const fullPath = path.join(nfsDirectory, reqPath);
        const {isDirectory, content} = req.body as CreateRequestBody;

        if (isDirectory === undefined) {
            return res.status(500).json({
                isSuccessful: false,
                message: "Not enough information provided",
            });
        }

        if (fs.existsSync(fullPath)) {
            return res.status(400).json({
                isSuccessful: false,
                message: "Directory/File already exists in this path",
            });
        }

        if (isDirectory) {
            fs.mkdirSync(fullPath, {recursive: true});
            return res.status(201).json({
                isSuccessful: true,
                message: "Directory Created",
            });
        }

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