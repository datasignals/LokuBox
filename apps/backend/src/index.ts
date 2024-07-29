import fs from "fs";
import Cors from "cors";
import Express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "node:path";

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

app.get("/", (req, res) => {
    res
        .status(200)
        .send("hello world");
})


// API to list files in a directory
app.get('/files', async (req, res) => {
    try {
        const files = fs.readdirSync(nfsDirectory);
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API to read a file
app.get('/files/:filename', async (req, res) => {
    try {
        const filePath = path.join(nfsDirectory, req.params.filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        res.send(fileContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API to write a file
app.post('/files/:filename', async (req, res) => {
    try {
        const filePath = path.join(nfsDirectory, req.params.filename);
        fs.writeFileSync(filePath, req.body.content);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






app.listen(port, () => console.log(`LokuBox Backend listening on port ${port}`));
