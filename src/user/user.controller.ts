import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import type { RoleT } from 'src/types/roleType';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(['admin', 'manager'])
  async getAll() {
    return await this.userService.getAllUsers();
  }

  @Put('/role')
  @Roles(['admin'])
  async addRole(
    @Query('googleId') userGoogleId: string,
    @Query('role') role: RoleT,
  ) {
    return await this.userService.addRole(userGoogleId, role);
  }

  @Delete('/role')
  @Roles(['admin'])
  async deleteRole(
    @Query('googleId') userGoogleId: string,
    @Query('role') role: RoleT,
  ) {
    return await this.userService.deleteRole(userGoogleId, role);
  }

  @Delete()
  @Roles(['admin'])
  async deleteUser(@Query('googleId') googleId: string) {
    return await this.userService.deleteUser(googleId);
  }
}
