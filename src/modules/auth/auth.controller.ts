import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  Param,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt.service';
import { EncryptionService } from './encryption.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Headers('authorization') authHeader: string) {
    return await this.jwtAuthService.refreshToken(authHeader);
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

  @Post('verify-otp/:userId')
  async verifyOTP(
    @Param('userId') userId: string,
    @Body('otp') otp: string,
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; message: string; access_token: string }> {
    await this.jwtAuthService.checkRoleOTP(authHeader, 'user');
    return await this.authService.verifyOTP(userId, otp);
  }

  @Post('resend-qrcode/:userId')
  async resendQRCode(
    @Param('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ) {
    await this.jwtAuthService.checkRoleOTP(authHeader, 'user');
    return await this.authService.resendQRCode(userId);
  }

  @Post('decrypt-private-key')
  async decryptPrivateKey(@Body() body) {
    const { encryptedPrivateKey, aesEncryptedKey, iv } = body;
    const privateKey = EncryptionService.decryptPrivateKey(
      encryptedPrivateKey,
      aesEncryptedKey,
      iv,
    );
    return privateKey;
  }
}
