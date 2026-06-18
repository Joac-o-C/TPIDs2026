import { ExternalUser } from '../placeholder-user.types';
import { PlaceholderUsersGateway } from './placeholder-users.gateway';
export declare class LocalGateway implements PlaceholderUsersGateway {
    private readonly users;
    constructor();
    fetchAll(): Promise<ExternalUser[]>;
    fetchById(id: number): Promise<ExternalUser>;
}
