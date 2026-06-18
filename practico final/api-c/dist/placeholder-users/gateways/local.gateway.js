"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalGateway = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const placeholder_users_gateway_1 = require("./placeholder-users.gateway");
class LocalGateway {
    users;
    constructor() {
        const filePath = (0, path_1.join)(__dirname, '..', 'data', 'users.json');
        const raw = (0, fs_1.readFileSync)(filePath, 'utf-8');
        this.users = JSON.parse(raw);
    }
    async fetchAll() {
        return this.users;
    }
    async fetchById(id) {
        const user = this.users.find((u) => u.id === id);
        if (!user)
            throw new placeholder_users_gateway_1.PlaceholderUserNotFoundError();
        return user;
    }
}
exports.LocalGateway = LocalGateway;
//# sourceMappingURL=local.gateway.js.map