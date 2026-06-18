"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceholderUsersService = void 0;
const common_1 = require("@nestjs/common");
const placeholder_users_gateway_1 = require("../gateways/placeholder-users.gateway");
let PlaceholderUsersService = class PlaceholderUsersService {
    gateway;
    constructor(gateway) {
        this.gateway = gateway;
    }
    async findAll() {
        try {
            return await this.gateway.fetchAll();
        }
        catch {
            throw new common_1.BadGatewayException('Upstream users service failed');
        }
    }
    async findOne(id) {
        try {
            return await this.gateway.fetchById(id);
        }
        catch (err) {
            if (err instanceof placeholder_users_gateway_1.PlaceholderUserNotFoundError) {
                throw new common_1.NotFoundException('User not found');
            }
            throw new common_1.BadGatewayException('Upstream users service failed');
        }
    }
};
exports.PlaceholderUsersService = PlaceholderUsersService;
exports.PlaceholderUsersService = PlaceholderUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(placeholder_users_gateway_1.PLACEHOLDER_USERS_GATEWAY)),
    __metadata("design:paramtypes", [typeof (_a = typeof placeholder_users_gateway_1.PlaceholderUsersGateway !== "undefined" && placeholder_users_gateway_1.PlaceholderUsersGateway) === "function" ? _a : Object])
], PlaceholderUsersService);
//# sourceMappingURL=placeholder-users.service.js.map