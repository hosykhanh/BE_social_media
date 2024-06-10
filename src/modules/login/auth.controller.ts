import { Controller, Post, Body } from '@nestjs/common';
import { JwtAuthService } from './jwt.service';
import { UserService } from '../users/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      return { status: 'err', message: 'The user does not exist' };
    }

    if (loginDto.password !== user.password) {
      return { status: 'err', message: 'Email or password is incorrect' };
    }

    const access_token = await this.jwtAuthService.generateAccessToken({
      id: user._id,
      isAdmin: user.isAdmin,
    });

    const refresh_token = await this.jwtAuthService.generateRefreshToken({
      id: user._id,
      isAdmin: user.isAdmin,
    });

    return {
      status: 'OK',
      message: 'Login successful',
      access_token,
      refresh_token,
    };
  }

  @Post('refresh')
  async refresh(@Body('token') token: string) {
    return await this.jwtAuthService.refreshToken(token);
  }
}
