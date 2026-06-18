import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { UserRole } from './user-role.enum';
import { RegisterUserDto } from './dto/user.dto';

export type SafeUser = {
  id: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService,
  ) {}

  async register(dto: RegisterUserDto): Promise<SafeUser> {
    const email = dto.email.trim().toLowerCase();
    const exists = await this.usersRepo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    const countUsers = await this.usersRepo.count();
    const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;

    const entity = this.usersRepo.create({ email, passwordHash, role });
    const saved = await this.usersRepo.save(entity);
    return { id: saved.id, email: saved.email, role: saved.role };
  }

  async validateCredentials(
    email: string,
    plain: string,
  ): Promise<SafeUser> {
    const normalized = email.trim().toLowerCase();
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: normalized })
      .getOne();

    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await bcrypt.compare(plain, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    return { id: user.id, email: user.email, role: user.role };
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<SafeUser[]> {
    const all = await this.usersRepo.find();
    return all.map((u) => ({ id: u.id, email: u.email, role: u.role }));
  }

  async updateRole(id: string, role: UserRole): Promise<SafeUser> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    await this.usersRepo.save(user);
    return { id: user.id, email: user.email, role: user.role };
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepo.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
  }
}
