"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryNode = void 0;
var DirectoryNode = /** @class */ (function () {
    function DirectoryNode(conf) {
        var _a, _b;
        this.directories = new Map();
        this.files = new Map();
        this.name = conf.name;
        (_a = conf.files) === null || _a === void 0 ? void 0 : _a.forEach(this.addFile);
        (_b = conf.directories) === null || _b === void 0 ? void 0 : _b.forEach(this.addDirectory);
    }
    DirectoryNode.prototype.addFile = function (file) {
        if (!this.files.get(file.name)) {
            this.files.set(file.name, file);
        }
    };
    DirectoryNode.prototype.addDirectory = function (directory) {
        if (!this.directories.get(directory.name)) {
            this.directories.set(directory.name, directory);
        }
    };
    return DirectoryNode;
}());
exports.DirectoryNode = DirectoryNode;
