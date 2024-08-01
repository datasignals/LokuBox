"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmountNfs = exports.mountNfs2 = exports.mountNfs1 = void 0;
const child_process = __importStar(require("node:child_process"));
const mountNfs1 = async (path) => {
    await execPromise(`mount_nfs -o nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=11111,mountport=11111 localhost:/ ${path}`);
};
exports.mountNfs1 = mountNfs1;
const mountNfs2 = async (path) => {
    await execPromise(`mount_nfs -o nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=11112,mountport=11112 localhost:/ ${path}`);
};
exports.mountNfs2 = mountNfs2;
const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        child_process
            .exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            }
            else {
                resolve({ stdout, stderr });
            }
        });
    });
};
const unmountNfs = async (path) => {
    await execPromise(`umount ${path}`);
    // child_process
    //     .exec(`umount ${path}`)
};
exports.unmountNfs = unmountNfs;
