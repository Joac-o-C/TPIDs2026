import { ExternalUser } from '../placeholder-user.types';

export const PLACEHOLDER_USERS_GATEWAY = 'PLACEHOLDER_USERS_GATEWAY';

export class PlaceholderUserNotFoundError extends Error {
  constructor(message = 'User not found') {
    super(message);
    this.name = 'PlaceholderUserNotFoundError';
  }
}

export interface PlaceholderUsersGateway {
  fetchAll(): Promise<ExternalUser[]>;
  fetchById(id: number): Promise<ExternalUser>;
}
