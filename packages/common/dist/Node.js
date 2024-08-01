"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hello = exports.Node = void 0;
var Node = /** @class */ (function () {
    function Node(conf) {
        this.name = conf.name;
    }
    return Node;
}());
exports.Node = Node;
var Hello = /** @class */ (function () {
    function Hello() {
    }
    Hello.prototype.world = function () {
        return "world";
    };
    return Hello;
}());
exports.Hello = Hello;
