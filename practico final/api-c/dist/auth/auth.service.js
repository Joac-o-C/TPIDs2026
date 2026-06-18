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
var AuthService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const mail_service_1 = require("../mail/mail.service");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    mailService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(dto) {
        const { user, verificationToken } = await this.usersService.register(dto);
        await this.mailService.sendVerificationEmail(user.email, verificationToken);
        const access_token = this.sign(user);
        return { user, access_token };
    }
    async verifyEmail(token) {
        await this.usersService.verifyEmail(token);
        return { message: 'Email verificado correctamente' };
    }
    async resendVerification(userId) {
        const { email, verificationToken } = await this.usersService.regenerateVerification(userId);
        await this.mailService.sendVerificationEmail(email, verificationToken);
        return { message: 'Email de verificación reenviado' };
    }
    async forgotPassword(email) {
        const result = await this.usersService.createResetToken(email);
        if (result) {
            try {
                await this.mailService.sendPasswordResetEmail(result.email, result.token);
            }
            catch (err) {
                this.logger.error(`No se pudo enviar el email de reset a ${result.email}`, err);
            }
        }
        return {
            message: 'Si el email está registrado, te enviamos un enlace para restablecer la contraseña',
        };
    }
    async resetPassword(token, password) {
        await this.usersService.resetPassword(token, password);
        return { message: 'Contraseña actualizada correctamente' };
    }
    async login(dto) {
        const user = await this.usersService.validateCredentials(dto.email, dto.password);
        return { user, access_token: this.sign(user) };
    }
    sign(user) {
        return this.jwtService.sign({ sub: user.id, role: user.role });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _c : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map