"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPlaceholderGateway = void 0;
const axios_1 = require("axios");
const placeholder_users_gateway_1 = require("./placeholder-users.gateway");
class JsonPlaceholderGateway {
    async fetchAll() {
        const { data } = await axios_1.default.get('https://jsonplaceholder.typicode.com/users');
        return data;
    }
    async fetchById(id) {
        try {
            const { data } = await axios_1.default.get(`https://jsonplaceholder.typicode.com/users/${id}`);
            if (!data || Object.keys(data).length === 0) {
                throw new placeholder_users_gateway_1.PlaceholderUserNotFoundError();
            }
            return data;
        }
        catch (err) {
            if (axios_1.default.isAxiosError(err) && err.response?.status === 404) {
                throw new placeholder_users_gateway_1.PlaceholderUserNotFoundError();
            }
            throw err;
        }
    }
}
exports.JsonPlaceholderGateway = JsonPlaceholderGateway;
//# sourceMappingURL=jsonplaceholder.gateway.js.map