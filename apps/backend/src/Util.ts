import * as child_process from "node:child_process";


export const mountNfs1 = async (path: string) => {
    await execPromise(`mount_nfs -o nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=2049,mountport=2049 localhost:/ ${path}`)
}

export const mountNfs2 = async (path: string) => {
    await execPromise(`mount_nfs -o nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=2049,mountport=2049 localhost:/ ${path}`);
}

const execPromise = (command: string): Promise<{ stdout: string, stderr: string }> => {
    return new Promise((resolve, reject) => {
        child_process
            .exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject({error, stderr});
                } else {
                    resolve({stdout, stderr});
                }
            });
    });
}


export const unmountNfs = async (path: string) => {
    await execPromise(`umount ${path}`)
    // child_process
    //     .exec(`umount ${path}`)
}