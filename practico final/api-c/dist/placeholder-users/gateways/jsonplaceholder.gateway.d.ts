import { ExternalUser } from '../placeholder-user.types';
import { PlaceholderUsersGateway } from './placeholder-users.gateway';
export declare class JsonPlaceholderGateway implements PlaceholderUsersGateway {
    fetchAll(): Promise<ExternalUser[]>;
    fetchById(id: number): Promise<ExternalUser>;
}
