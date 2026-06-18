import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
export type JwtPayload = {
    sub: string;
    role: string;
};
export type AuthenticatedUser = {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
};
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersRepo;
    constructor(cfg: ConfigService, usersRepo: Repository<UserEntity>);
    validate(payload: JwtPayload): Promise<AuthenticatedUser>;
}
export {};
