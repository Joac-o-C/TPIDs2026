import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginUserDto, RegisterUserDto, ResetPasswordDto, VerifyEmailDto } from '../users/dto/user.dto';
import { AuthenticatedUser } from './jwt.strategy';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterUserDto): any;
    login(dto: LoginUserDto): any;
    me(req: {
        user: AuthenticatedUser;
    }): AuthenticatedUser;
    verifyEmail(dto: VerifyEmailDto): any;
    resendVerification(req: {
        user: AuthenticatedUser;
    }): any;
    forgotPassword(dto: ForgotPasswordDto): any;
    resetPassword(dto: ResetPasswordDto): any;
}
