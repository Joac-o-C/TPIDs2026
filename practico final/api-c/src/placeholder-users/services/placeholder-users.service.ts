import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExternalUser } from '../placeholder-user.types';
import {
  PLACEHOLDER_USERS_GATEWAY,
  PlaceholderUserNotFoundError,
  PlaceholderUsersGateway,
} from '../gateways/placeholder-users.gateway';

@Injectable()
export class PlaceholderUsersService {
  constructor(
    @Inject(PLACEHOLDER_USERS_GATEWAY)
    private readonly gateway: PlaceholderUsersGateway,
  ) {}

  async findAll(): Promise<ExternalUser[]> {
    try {
      return await this.gateway.fetchAll();
    } catch {
      throw new BadGatewayException('Upstream users service failed');
    }
  }

  async findOne(id: number): Promise<ExternalUser> {
    try {
      return await this.gateway.fetchById(id);
    } catch (err) {
      if (err instanceof PlaceholderUserNotFoundError) {
        throw new NotFoundException('User not found');
      }
      throw new BadGatewayException('Upstream users service failed');
    }
  }
}
