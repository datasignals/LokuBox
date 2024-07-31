import fs from "fs";
import Cors from "cors";
import Express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "node:path";
import {mountNfs1, mountNfs2, unmountNfs} from "./Util";

//Init server
const app = Express()
//Port
const port = 3001; //TODO
//CORS Middleware
app.use(Cors({credentials: true}));
app.use(bodyParser.json());

fs.mkdirSync("/tmp/LokuBox/files", {recursive: true})

app.use(session({
    name: "mainSession",
    secret: "secretimportantchangeme",
    resave: true,
    saveUninitialized: true,
    rolling: true,
    store: new session.MemoryStore(),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 60 * 1000, //2 Hours
    }
}));

fs.mkdirSync("/tmp/nfs", {recursive: true});
const nfsDirectory = '/tmp/nfs'; // The mount point of your NFS share

// console.log('1');
// mountNfs1(nfsDirectory).catch(() => null)

// app.get("/mount", async (req, res) => {
//     const path = req.query.path.toString();
//
//     if (path === "1" || path ===  "2") {
//         await unmountNfs(nfsDirectory);
//
//         console.log('mounting nfs...');
//
//         path === "1" ?
//             await mountNfs1(nfsDirectory):
//             await mountNfs2(nfsDirectory);
//
//         return res
//             .status(200)
//             .send("NFS dir changed");
//     }  else {
//         return res
//             .status(404)
//             .send("NFS dir does not exist");
//     }
// });
//
// app.get("/info", (req, res) => {
//     return res.status(200).send(nfsDirectory);
// })
//
//
// // API to list files in a directory
// app.get('/files', async (req, res) => {
//     try {
//         const files = fs.readdirSync(nfsDirectory);
//         res.json(files);
//     } catch (error) {
//         res.status(500).json({error: error.message});
//     }
// });
//
// // API to read a file
// app.get('/files/:filename', async (req, res) => {
//     try {
//         const filePath = path.join(nfsDirectory, req.params.filename);
//         const fileContent = fs.readFileSync(filePath, 'utf-8');
//         res.send(fileContent);
//     } catch (error) {
//         res.status(500).json({error: error.message});
//     }
// });
//
// // API to write a file
// app.post('/files/:filename', async (req, res) => {
//     try {
//         const filePath = path.join(nfsDirectory, req.params.filename);
//         fs.writeFileSync(filePath, req.body.content);
//         res.sendStatus(200);
//     } catch (error) {
//         res.status(500).json({error: error.message});
//     }
// });










// List directory contents
app.get('/*', async (req: Request, res: Response) => {
    try {
        const files = await fs.readdir(nfsDirectory);
        return res.json({hello: "world"});
    } catch (err) {
        return res.status(500).send('Error listing directory contents');
    }
});

// Open file (text files are returned as text, others as download)
app.get('/open/:filename', async (req: Request, res: Response) => {
    const { filename } = req.params;
    const filePath = path.join(folderPath, filename);

    try {
        const stat = await fs.stat(filePath);

        if (stat.isFile()) {
            const ext = path.extname(filename).toLowerCase();
            if (ext === '.txt') {
                const content = await fs.readFile(filePath, 'utf-8');
                res.send(content);
            } else {
                const content: Buffer = await fs.readFile(filePath);
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.send(content);
            }
        } else {
            res.status(400).send('Not a file');
        }
    } catch (err) {
        res.status(500).send('Error opening file');
    }
});

// Create a new file
app.post('/create-file', async (req: Request, res: Response) => {
    const { filename, content } = req.body;

    if (!filename || typeof content !== 'string') {
        return res.status(400).send('Filename and content required');
    }

    const filePath = path.join(folderPath, filename);

    try {
        await fs.writeFile(filePath, content);
        res.send('File created');
    } catch (err) {
        res.status(500).send('Error creating file');
    }
});

// Create a new directory
app.post('/create-directory', async (req: Request, res: Response) => {
    const { dirname } = req.body;

    if (!dirname) {
        return res.status(400).send('Directory name required');
    }

    const dirPath = path.join(folderPath, dirname);

    try {
        await fs.mkdir(dirPath);
        res.send('Directory created');
    } catch (err) {
        res.status(500).send('Error creating directory');
    }
});

// Delete a file or directory
app.delete('/delete/:name', async (req: Request, res: Response) => {
    const { name } = req.params;
    const itemPath = path.join(folderPath, name);

    try {
        const stat = await fs.stat(itemPath);

        if (stat.isFile()) {
            await fs.remove(itemPath);
            res.send('File deleted');
        } else if (stat.isDirectory()) {
            await fs.remove(itemPath);
            res.send('Directory deleted');
        } else {
            res.status(400).send('Not a file or directory');
        }
    } catch (err) {
        res.status(500).send('Error deleting item');
    }
});


app.listen(port, () => console.log(`LokuBox Backend listening on port ${port}`));
