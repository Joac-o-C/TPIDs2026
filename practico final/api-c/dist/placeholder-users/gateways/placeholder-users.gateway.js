"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceholderUserNotFoundError = exports.PLACEHOLDER_USERS_GATEWAY = void 0;
exports.PLACEHOLDER_USERS_GATEWAY = 'PLACEHOLDER_USERS_GATEWAY';
class PlaceholderUserNotFoundError extends Error {
    constructor(message = 'User not found') {
        super(message);
        this.name = 'PlaceholderUserNotFoundError';
    }
}
exports.PlaceholderUserNotFoundError = PlaceholderUserNotFoundError;
//# sourceMappingURL=placeholder-users.gateway.js.map