import { readFileSync } from 'fs';
import { join } from 'path';
import { ExternalUser } from '../placeholder-user.types';
import {
  PlaceholderUserNotFoundError,
  PlaceholderUsersGateway,
} from './placeholder-users.gateway';

export class LocalGateway implements PlaceholderUsersGateway {
  private readonly users: ExternalUser[];

  constructor() {
    const filePath = join(__dirname, '..', 'data', 'users.json');
    const raw = readFileSync(filePath, 'utf-8');
    this.users = JSON.parse(raw) as ExternalUser[];
  }

  async fetchAll(): Promise<ExternalUser[]> {
    return this.users;
  }

  async fetchById(id: number): Promise<ExternalUser> {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new PlaceholderUserNotFoundError();
    return user;
  }
}
