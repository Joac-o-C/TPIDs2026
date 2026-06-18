"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceholderUsersModule = void 0;
const common_1 = require("@nestjs/common");
const placeholder_users_controller_1 = require("./controllers/placeholder-users.controller");
const jsonplaceholder_gateway_1 = require("./gateways/jsonplaceholder.gateway");
const local_gateway_1 = require("./gateways/local.gateway");
const placeholder_users_gateway_1 = require("./gateways/placeholder-users.gateway");
const placeholder_users_service_1 = require("./services/placeholder-users.service");
let PlaceholderUsersModule = class PlaceholderUsersModule {
};
exports.PlaceholderUsersModule = PlaceholderUsersModule;
exports.PlaceholderUsersModule = PlaceholderUsersModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [placeholder_users_controller_1.PlaceholderUsersController],
        providers: [
            placeholder_users_service_1.PlaceholderUsersService,
            {
                provide: placeholder_users_gateway_1.PLACEHOLDER_USERS_GATEWAY,
                useFactory: () => process.env.USERS_SOURCE === 'local'
                    ? new local_gateway_1.LocalGateway()
                    : new jsonplaceholder_gateway_1.JsonPlaceholderGateway(),
            },
        ],
        exports: [placeholder_users_service_1.PlaceholderUsersService, placeholder_users_gateway_1.PLACEHOLDER_USERS_GATEWAY],
    })
], PlaceholderUsersModule);
//# sourceMappingURL=placeholder-users.module.js.map