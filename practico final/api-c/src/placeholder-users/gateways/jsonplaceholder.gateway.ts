import axios from 'axios';
import { ExternalUser } from '../placeholder-user.types';
import {
  PlaceholderUserNotFoundError,
  PlaceholderUsersGateway,
} from './placeholder-users.gateway';

export class JsonPlaceholderGateway implements PlaceholderUsersGateway {
  async fetchAll(): Promise<ExternalUser[]> {
    const { data } = await axios.get<ExternalUser[]>(
      'https://jsonplaceholder.typicode.com/users',
    );
    return data;
  }

  async fetchById(id: number): Promise<ExternalUser> {
    try {
      const { data } = await axios.get<ExternalUser>(
        `https://jsonplaceholder.typicode.com/users/${id}`,
      );
      if (!data || Object.keys(data).length === 0) {
        throw new PlaceholderUserNotFoundError();
      }
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        throw new PlaceholderUserNotFoundError();
      }
      throw err;
    }
  }
}
