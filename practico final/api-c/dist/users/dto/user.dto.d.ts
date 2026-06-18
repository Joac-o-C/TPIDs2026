import { UserRole } from '../user-role.enum';
export declare class RegisterUserDto {
    email: string;
    password: string;
}
export declare class LoginUserDto {
    email: string;
    password: string;
}
export declare class UpdateUserRoleDto {
    role: UserRole;
}
export declare class VerifyEmailDto {
    token: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    password: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class ChangeEmailDto {
    currentPassword: string;
    newEmail: string;
}
