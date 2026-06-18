import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { UserRole } from './user-role.enum';
import { RegisterUserDto } from './dto/user.dto';

export type SafeUser = {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService,
  ) {}

  async register(
    dto: RegisterUserDto,
  ): Promise<{ user: SafeUser; verificationToken: string }> {
    const email = dto.email.trim().toLowerCase();
    const exists = await this.usersRepo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    const countUsers = await this.usersRepo.count();
    const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;

    const verificationToken = randomUUID();
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

  async validateCredentials(email: string, plain: string): Promise<SafeUser> {
    const normalized = email.trim().toLowerCase();
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: normalized })
      .getOne();

    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await bcrypt.compare(plain, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    return this.toSafe(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<SafeUser[]> {
    const all = await this.usersRepo.find();
    return all.map((u) => this.toSafe(u));
  }

  async updateRole(id: string, role: UserRole): Promise<SafeUser> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    await this.usersRepo.save(user);
    return this.toSafe(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepo.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.usersRepo.findOne({
      where: { verificationToken: token },
    });
    if (!user) throw new BadRequestException('Token de verificación inválido');
    user.isVerified = true;
    user.verificationToken = null;
    await this.usersRepo.save(user);
  }

  async regenerateVerification(
    userId: string,
  ): Promise<{ email: string; verificationToken: string }> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified) {
      throw new BadRequestException('El email ya está verificado');
    }
    const verificationToken = randomUUID();
    user.verificationToken = verificationToken;
    await this.usersRepo.save(user);
    return { email: user.email, verificationToken };
  }

  async createResetToken(
    email: string,
  ): Promise<{ email: string; token: string } | null> {
    const normalized = email.trim().toLowerCase();
    const user = await this.usersRepo.findOne({ where: { email: normalized } });
    if (!user) return null;
    const token = randomUUID();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await this.usersRepo.save(user);
    return { email: user.email, token };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect(['u.resetPasswordToken', 'u.resetPasswordExpires'])
      .where('u.resetPasswordToken = :token', { token })
      .getOne();

    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires.getTime() < Date.now()
    ) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    user.passwordHash = await bcrypt.hash(newPassword, rounds);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.usersRepo.save(user);
  }

  private toSafe(user: UserEntity): SafeUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
