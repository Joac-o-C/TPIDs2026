import { ExternalUser } from '../placeholder-user.types';
import { PlaceholderUsersService } from '../services/placeholder-users.service';
export declare class PlaceholderUsersController {
    private readonly service;
    constructor(service: PlaceholderUsersService);
    findAll(): Promise<ExternalUser[]>;
    findOne(id: number): Promise<ExternalUser>;
}
