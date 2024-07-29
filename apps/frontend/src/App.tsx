// src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface File {
    name: string;
}

export const App: React.FC = () => {
    const [files, setFiles] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [fileContent, setFileContent] = useState<string>('');
    const [newFileName, setNewFileName] = useState<string>('');
    const [newFileContent, setNewFileContent] = useState<string>('');

    useEffect(() => {
        axios.get('http://localhost:3001/files')
            .then(response => {
                setFiles(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the files!', error);
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

    return (
        <div className="App">
            <h1>File Explorer</h1>
            <div>
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
        </div>
    );
};