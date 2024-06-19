import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
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

  @Post('logout')
  async logout(
    @Body('refresh_token') refresh_token: string,
    @Res() res: Response,
  ) {
    try {
      res.clearCookie('refresh_token');

      return res.status(HttpStatus.OK).json({
        status: 'OK',
        message: 'Logout successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }
}
