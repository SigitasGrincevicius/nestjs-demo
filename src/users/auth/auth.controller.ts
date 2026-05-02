import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user.entity';
import { LoginDto } from '../user/login.dto';
import { LoginResponse } from '../login.response';
import type { AuthRequest } from '../auth.request';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../auth.guard';
import { Public } from '../decorators/public.decorator';
import { AdminResponse } from '../admin.response';
import { Role } from '../role.enum';
import { Roles } from '../decorators/roles.decorator';

/**
 * Controller handling authentication and authorization endpoints.
 * All responses are serialized using `excludeAll` strategy.
 */
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Registers a new user account.
   * @param createUserDto - Data required to create a new user.
   * @returns The newly created user.
   */
  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.register(createUserDto);
    return user;
  }

  /**
   * Authenticates a user and returns a JWT access token.
   * @param loginDto - The user's email and password credentials.
   * @returns A response containing the JWT access token.
   */
  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return new LoginResponse({ accessToken });
  }

  /**
   * Returns the profile of the currently authenticated user.
   * @param request - The authenticated request containing the user's JWT payload.
   * @returns The user entity of the authenticated user.
   * @throws NotFoundException if the user is not found.
   */
  @Get('/profile')
  async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.userService.findOne(request.user.sub);

    if (user) {
      return user;
    }

    throw new NotFoundException();
  }

  /**
   * A restricted endpoint accessible only to users with the Admin role.
   * @returns An admin-only response message.
   */
  @Get('admin')
  @Roles(Role.ADMIN)
  async adminOnly(): Promise<AdminResponse> {
    return new AdminResponse({ message: 'This is for admins only!' });
  }
}
