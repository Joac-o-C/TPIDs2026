import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ExternalUser } from '../placeholder-user.types';
import { PlaceholderUsersService } from '../services/placeholder-users.service';

@Controller('placeholder-users')
export class PlaceholderUsersController {
  constructor(private readonly service: PlaceholderUsersService) {}

  @Get()
  findAll(): Promise<ExternalUser[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ExternalUser> {
    return this.service.findOne(id);
  }
}
