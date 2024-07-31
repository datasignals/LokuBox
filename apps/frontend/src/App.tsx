// src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface File {
    name: string;
}

export const App: React.FC = () => {
    const [mount, setMount] = useState<string>("");
    const [newMount, setNewMount] = useState<string>("");

    const [files, setFiles] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [fileContent, setFileContent] = useState<string>('');
    const [newFileName, setNewFileName] = useState<string>('');
    const [newFileContent, setNewFileContent] = useState<string>('');


    const refreshFiles = () => {
        axios.get('http://localhost:3001/files')
            .then(response => {
                setFiles(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the files!', error);
            });
    }

    useEffect(() => {
        refreshFiles();

        axios.get('http://localhost:3001/info')
            .then(response => {
                setMount(response.data.toString());
            })
            .catch(error => {
                console.error('There was an error fetching the info!', error);
            });
    }, []);

    const readFile = (filename: string) => {
        axios.get(`http://localhost:3001/files/${filename}`)
            .then(response => {
                setSelectedFile(filename);
                setFileContent(response.data);
            })
            .catch(error => {
                console.error('There was an error reading the file!', error);
            });
    };

    const createFile = () => {
        axios.post(`http://localhost:3001/files/${newFileName}`, { content: newFileContent })
            .then(() => {
                setNewFileName('');
                setNewFileContent('');
                return axios.get('http://localhost:3001/files');
            })
            .then(response => {
                setFiles(response.data);
            })
            .catch(error => {
                console.error('There was an error creating the file!', error);
            });
    };

    const changeMount = (input: 1 | 2) => {
        axios.get(`http://localhost:3001/mount?path=${input}`)
            .finally(() => refreshFiles());

    }

    return (
        <div className="App">
            <h1>File Explorer</h1>
            <div>
                {mount.length > 0 ?
                    <h1>Backend NFS Mounted at: {mount}</h1> :
                    <h1>Backend has no NFS Mounted</h1>
                }

                <h2>Files</h2>
                <ul>
                    {files.map(file => (
                        <li key={file}>
                            <button onClick={() => readFile(file)}>{file}</button>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedFile && (
                <div>
                    <h2>Selected File: {selectedFile}</h2>
                    <pre>{fileContent}</pre>
                </div>
            )}
            <div>
                <h2>Create New File</h2>
                <input
                    type="text"
                    placeholder="File name"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                />
                <textarea
                    placeholder="File content"
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                />
                <button onClick={createFile}>Create File</button>
            </div>

            <br/>
            <br/>
            <br/>
            <div>
                <input type="button" onClick={() => changeMount(1)} value="Mount NFS 1"/>
                <input type="button" onClick={() => changeMount(2)} value="Mount NFS 2"/>
            </div>
        </div>
    );
};