"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
//Init server
const app = (0, express_1.default)();
//Port
const port = 3001; //TODO
//CORS Middleware
app.use((0, cors_1.default)({ credentials: true }));
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({
    name: "mainSession",
    secret: "secretimportantchangeme",
    resave: true,
    saveUninitialized: true,
    rolling: true,
    store: new express_session_1.default.MemoryStore(),
    cookie: {
        secure: process.env["NODE_ENV"] === 'production',
        maxAge: 2 * 60 * 60 * 1000, //2 Hours
    }
}));
const baseDir = "/tmp/nfs";
node_fs_1.default.mkdirSync(baseDir, { recursive: true });
app.get('/api/v1/root/*', (req, res) => {
    try {
        const reqPath = req.params[0] ?? '';
        const fullPath = node_path_1.default.join(baseDir, reqPath);
        const statResult = node_fs_1.default.statSync(fullPath);
        if (statResult.isDirectory()) {
            const contents = node_fs_1.default.readdirSync(fullPath);
            return res.status(200).json({
                isSuccessful: true,
                message: "Directory Returned",
                data: contents
            });
        }
        if (statResult.isFile()) {
            const contents = node_fs_1.default.readFileSync(fullPath);
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
    }
    catch (e) {
        return res.status(404).json({
            isSuccessful: false,
            message: "Not a File or Dir",
        });
    }
});
app.delete("/api/v1/root/*", (req, res) => {
    try {
        const reqPath = req.params[0] ?? '';
        const fullPath = node_path_1.default.join(baseDir, reqPath);
        const statResult = node_fs_1.default.statSync(fullPath);
        const isDir = statResult.isDirectory();
        // if (isDir || statResult.isFile()) {
        node_fs_1.default.rmSync(fullPath, { recursive: true, force: true });
        return res.status(200).json({
            isSuccessful: true,
            message: isDir ?
                "Directory Removed" :
                "File Removed",
        });
    }
    catch (e) {
        return res.status(404).json({
            isSuccessful: false,
            message: "Not a File or Dir",
        });
    }
});
//TODO it does not fail if file/dir already exists
app.post("/api/v1/root/*", (req, res) => {
    try {
        const reqPath = req.params[0] ?? '';
        const fullPath = node_path_1.default.join(baseDir, reqPath);
        const { isDirectory, content } = req.body;
        if (isDirectory === undefined) {
            return res.status(500).json({
                isSuccessful: false,
                message: "Not enough information provided",
            });
        }
        console.log("IS dir: " + isDirectory);
        if (isDirectory) {
            node_fs_1.default.mkdirSync(fullPath, { recursive: true });
            return res.status(201).json({
                isSuccessful: true,
                message: "Directory Created",
            });
        }
        console.log("writing file instead");
        node_fs_1.default.writeFileSync(fullPath, content ?? "");
        return res.status(201).json({
            isSuccessful: true,
            message: "File Created",
        });
    }
    catch (e) {
        return res.status(500).json({
            isSuccessful: false,
            message: "Failed to create file or directory",
        });
    }
});
app.listen(port, () => {
    console.log(`LokuBox Backend listening on port ${port}`);
});
