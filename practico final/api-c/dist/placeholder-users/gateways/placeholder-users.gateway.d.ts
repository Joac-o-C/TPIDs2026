import { ExternalUser } from '../placeholder-user.types';
export declare const PLACEHOLDER_USERS_GATEWAY = "PLACEHOLDER_USERS_GATEWAY";
export declare class PlaceholderUserNotFoundError extends Error {
    constructor(message?: string);
}
export interface PlaceholderUsersGateway {
    fetchAll(): Promise<ExternalUser[]>;
    fetchById(id: number): Promise<ExternalUser>;
}
