import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { HasRoles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserRole } from 'src/users/role.enum';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('auth/userSignup')
  createUser(@Body() user: UserDto) {
    return this.usersService.createUser(user);
  }

  @Post('auth/adminSignup')
  createAdmin(@Body() user: UserDto) {
    return this.usersService.createAdmin(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/userLogin')
  async userLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/adminLogin')
  async adminLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @HasRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  onlyAdmin(@Request() req) {
    return req.user;
  }

  @HasRoles(UserRole.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user')
  onlyUser(@Request() req) {
    return req.user;
  }
}
