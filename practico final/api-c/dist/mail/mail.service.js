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
var MailService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    cfg;
    logger = new common_1.Logger(MailService_1.name);
    transporter;
    from;
    frontendUrl;
    constructor(cfg) {
        this.cfg = cfg;
        this.transporter = nodemailer.createTransport({
            host: this.cfg.getOrThrow('MAIL_HOST'),
            port: Number(this.cfg.get('MAIL_PORT') ?? '2525'),
            auth: {
                user: this.cfg.getOrThrow('MAIL_USER'),
                pass: this.cfg.getOrThrow('MAIL_PASS'),
            },
        });
        this.from = this.cfg.get('MAIL_FROM') ?? 'no-reply@tpids.local';
        this.frontendUrl =
            this.cfg.get('FRONTEND_URL') ?? 'http://localhost:4200';
    }
    async sendVerificationEmail(to, token) {
        const url = `${this.frontendUrl}/verify-email?token=${token}`;
        await this.send(to, 'Verificá tu email', `<p>¡Bienvenido! Confirmá tu cuenta haciendo clic en el siguiente enlace:</p>
       <p><a href="${url}">Verificar mi email</a></p>
       <p>Si no creaste esta cuenta, ignorá este mensaje.</p>`);
    }
    async sendPasswordResetEmail(to, token) {
        const url = `${this.frontendUrl}/reset-password?token=${token}`;
        await this.send(to, 'Restablecé tu contraseña', `<p>Recibimos un pedido para restablecer tu contraseña.</p>
       <p><a href="${url}">Crear una nueva contraseña</a></p>
       <p>El enlace vence en 1 hora. Si no lo solicitaste, ignorá este mensaje.</p>`);
    }
    async send(to, subject, html) {
        await this.transporter.sendMail({ from: this.from, to, subject, html });
        this.logger.log(`Email "${subject}" enviado a ${to}`);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], MailService);
//# sourceMappingURL=mail.service.js.map