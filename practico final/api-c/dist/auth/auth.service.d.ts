import { JwtService } from '@nestjs/jwt';
import { UsersService, SafeUser } from '../users/users.service';
import { LoginUserDto, RegisterUserDto } from '../users/dto/user.dto';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly mailService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService);
    register(dto: RegisterUserDto): Promise<{
        user: SafeUser;
        access_token: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerification(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
    login(dto: LoginUserDto): Promise<{
        user: SafeUser;
        access_token: string;
    }>;
    private sign;
}
