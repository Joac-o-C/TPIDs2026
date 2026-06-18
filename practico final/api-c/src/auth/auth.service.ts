import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, SafeUser } from '../users/users.service';
import { LoginUserDto, RegisterUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterUserDto,
  ): Promise<{ user: SafeUser; access_token: string }> {
    const user = await this.usersService.register(dto);
    const access_token = this.sign(user);
    return { user, access_token };
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
