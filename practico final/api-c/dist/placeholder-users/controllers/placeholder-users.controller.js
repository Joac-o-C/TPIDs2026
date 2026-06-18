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
exports.PlaceholderUsersController = void 0;
const common_1 = require("@nestjs/common");
const placeholder_users_service_1 = require("../services/placeholder-users.service");
let PlaceholderUsersController = class PlaceholderUsersController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
};
exports.PlaceholderUsersController = PlaceholderUsersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlaceholderUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlaceholderUsersController.prototype, "findOne", null);
exports.PlaceholderUsersController = PlaceholderUsersController = __decorate([
    (0, common_1.Controller)('placeholder-users'),
    __metadata("design:paramtypes", [typeof (_a = typeof placeholder_users_service_1.PlaceholderUsersService !== "undefined" && placeholder_users_service_1.PlaceholderUsersService) === "function" ? _a : Object])
], PlaceholderUsersController);
//# sourceMappingURL=placeholder-users.controller.js.map