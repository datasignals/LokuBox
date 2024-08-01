"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNode = void 0;
var FileNode = /** @class */ (function () {
    function FileNode(conf) {
        this.name = conf.name;
        this.type = conf.type;
        this.contents = conf.contents;
    }
    return FileNode;
}());
exports.FileNode = FileNode;
