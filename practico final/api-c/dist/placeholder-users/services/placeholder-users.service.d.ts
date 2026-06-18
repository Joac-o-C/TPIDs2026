import { ExternalUser } from '../placeholder-user.types';
import { PlaceholderUsersGateway } from '../gateways/placeholder-users.gateway';
export declare class PlaceholderUsersService {
    private readonly gateway;
    constructor(gateway: PlaceholderUsersGateway);
    findAll(): Promise<ExternalUser[]>;
    findOne(id: number): Promise<ExternalUser>;
}
