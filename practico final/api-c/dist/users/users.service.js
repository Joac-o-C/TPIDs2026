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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./user.entity");
const user_role_enum_1 = require("./user-role.enum");
let UsersService = class UsersService {
    usersRepo;
    cfg;
    constructor(usersRepo, cfg) {
        this.usersRepo = usersRepo;
        this.cfg = cfg;
    }
    async register(dto) {
        const email = dto.email.trim().toLowerCase();
        const exists = await this.usersRepo.findOne({ where: { email } });
        if (exists)
            throw new common_1.ConflictException('Email already registered');
        const rounds = Number(this.cfg.get('BCRYPT_COST') ?? '12');
        const passwordHash = await bcrypt.hash(dto.password, rounds);
        const countUsers = await this.usersRepo.count();
        const role = countUsers === 0 ? user_role_enum_1.UserRole.ADMIN : user_role_enum_1.UserRole.USER;
        const verificationToken = (0, crypto_1.randomUUID)();
        const entity = this.usersRepo.create({
            email,
            passwordHash,
            role,
            isVerified: false,
            verificationToken,
        });
        const saved = await this.usersRepo.save(entity);
        return { user: this.toSafe(saved), verificationToken };
    }
    async validateCredentials(email, plain) {
        const normalized = email.trim().toLowerCase();
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.email = :email', { email: normalized })
            .getOne();
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const ok = await bcrypt.compare(plain, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        return this.toSafe(user);
    }
    async findById(id) {
        return this.usersRepo.findOne({ where: { id } });
    }
    async findAll() {
        const all = await this.usersRepo.find();
        return all.map((u) => this.toSafe(u));
    }
    async updateRole(id, role) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.role = role;
        await this.usersRepo.save(user);
        return this.toSafe(user);
    }
    async remove(id) {
        const result = await this.usersRepo.delete(id);
        if (!result.affected)
            throw new common_1.NotFoundException('User not found');
    }
    async verifyEmail(token) {
        const user = await this.usersRepo.findOne({
            where: { verificationToken: token },
        });
        if (!user)
            throw new common_1.BadRequestException('Token de verificación inválido');
        user.isVerified = true;
        user.verificationToken = null;
        await this.usersRepo.save(user);
    }
    async regenerateVerification(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.isVerified) {
            throw new common_1.BadRequestException('El email ya está verificado');
        }
        const verificationToken = (0, crypto_1.randomUUID)();
        user.verificationToken = verificationToken;
        await this.usersRepo.save(user);
        return { email: user.email, verificationToken };
    }
    async createResetToken(email) {
        const normalized = email.trim().toLowerCase();
        const user = await this.usersRepo.findOne({ where: { email: normalized } });
        if (!user)
            return null;
        const token = (0, crypto_1.randomUUID)();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
        await this.usersRepo.save(user);
        return { email: user.email, token };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect(['u.resetPasswordToken', 'u.resetPasswordExpires'])
            .where('u.resetPasswordToken = :token', { token })
            .getOne();
        if (!user ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires.getTime() < Date.now()) {
            throw new common_1.BadRequestException('Token inválido o expirado');
        }
        const rounds = Number(this.cfg.get('BCRYPT_COST') ?? '12');
        user.passwordHash = await bcrypt.hash(newPassword, rounds);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.usersRepo.save(user);
    }
    async changePassword(userId, dto) {
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.id = :id', { id: userId })
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        if (dto.currentPassword === dto.newPassword) {
            throw new common_1.BadRequestException('La nueva contraseña debe ser distinta de la actual');
        }
        const rounds = Number(this.cfg.get('BCRYPT_COST') ?? '12');
        user.passwordHash = await bcrypt.hash(dto.newPassword, rounds);
        await this.usersRepo.save(user);
        return this.toSafe(user);
    }
    async changeEmail(userId, dto) {
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.id = :id', { id: userId })
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const newEmail = dto.newEmail.trim().toLowerCase();
        if (newEmail !== user.email) {
            const exists = await this.usersRepo.findOne({ where: { email: newEmail } });
            if (exists)
                throw new common_1.ConflictException('Email already registered');
        }
        const verificationToken = (0, crypto_1.randomUUID)();
        user.email = newEmail;
        user.isVerified = false;
        user.verificationToken = verificationToken;
        await this.usersRepo.save(user);
        return { user: this.toSafe(user), verificationToken };
    }
    toSafe(user) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], UsersService);
//# sourceMappingURL=users.service.js.map