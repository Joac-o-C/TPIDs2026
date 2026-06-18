import { Global, Module } from '@nestjs/common';
import { PlaceholderUsersController } from './controllers/placeholder-users.controller';
import { JsonPlaceholderGateway } from './gateways/jsonplaceholder.gateway';
import { LocalGateway } from './gateways/local.gateway';
import { PLACEHOLDER_USERS_GATEWAY } from './gateways/placeholder-users.gateway';
import { PlaceholderUsersService } from './services/placeholder-users.service';

@Global()
@Module({
  controllers: [PlaceholderUsersController],
  providers: [
    PlaceholderUsersService,
    {
      provide: PLACEHOLDER_USERS_GATEWAY,
      useFactory: () =>
        process.env.USERS_SOURCE === 'local'
          ? new LocalGateway()
          : new JsonPlaceholderGateway(),
    },
  ],
  exports: [PlaceholderUsersService, PLACEHOLDER_USERS_GATEWAY],
})
export class PlaceholderUsersModule {}
