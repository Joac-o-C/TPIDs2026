import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRole } from './user-role.enum';
import { ChangeEmailDto, ChangePasswordDto, RegisterUserDto } from './dto/user.dto';
export type SafeUser = {
    id: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
};
export declare class UsersService {
    private readonly usersRepo;
    private readonly cfg;
    constructor(usersRepo: Repository<UserEntity>, cfg: ConfigService);
    register(dto: RegisterUserDto): Promise<{
        user: SafeUser;
        verificationToken: string;
    }>;
    validateCredentials(email: string, plain: string): Promise<SafeUser>;
    findById(id: string): Promise<UserEntity | null>;
    findAll(): Promise<SafeUser[]>;
    updateRole(id: string, role: UserRole): Promise<SafeUser>;
    remove(id: string): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    regenerateVerification(userId: string): Promise<{
        email: string;
        verificationToken: string;
    }>;
    createResetToken(email: string): Promise<{
        email: string;
        token: string;
    } | null>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<SafeUser>;
    changeEmail(userId: string, dto: ChangeEmailDto): Promise<{
        user: SafeUser;
        verificationToken: string;
    }>;
    private toSafe;
}
