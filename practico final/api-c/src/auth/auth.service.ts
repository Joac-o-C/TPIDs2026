import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, SafeUser } from '../users/users.service';
import { LoginUserDto, RegisterUserDto } from '../users/dto/user.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(
    dto: RegisterUserDto,
  ): Promise<{ user: SafeUser; access_token: string }> {
    const { user, verificationToken } = await this.usersService.register(dto);
    await this.mailService.sendVerificationEmail(user.email, verificationToken);
    const access_token = this.sign(user);
    return { user, access_token };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    await this.usersService.verifyEmail(token);
    return { message: 'Email verificado correctamente' };
  }

  async resendVerification(userId: string): Promise<{ message: string }> {
    const { email, verificationToken } =
      await this.usersService.regenerateVerification(userId);
    await this.mailService.sendVerificationEmail(email, verificationToken);
    return { message: 'Email de verificación reenviado' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const result = await this.usersService.createResetToken(email);
    if (result) {
      await this.mailService.sendPasswordResetEmail(result.email, result.token);
    }
    return {
      message:
        'Si el email está registrado, te enviamos un enlace para restablecer la contraseña',
    };
  }

  async resetPassword(
    token: string,
    password: string,
  ): Promise<{ message: string }> {
    await this.usersService.resetPassword(token, password);
    return { message: 'Contraseña actualizada correctamente' };
  }

  async login(
    dto: LoginUserDto,
  ): Promise<{ user: SafeUser; access_token: string }> {
    const user = await this.usersService.validateCredentials(
      dto.email,
      dto.password,
    );
    return { user, access_token: this.sign(user) };
  }

  private sign(user: SafeUser): string {
    return this.jwtService.sign({ sub: user.id, role: user.role });
  }
}
