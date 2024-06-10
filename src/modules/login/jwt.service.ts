import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '60m',
    });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '12h',
    });
  }

  async refreshToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const accessToken = await this.generateAccessToken({
        id: decoded.id,
        isAdmin: decoded.isAdmin,
      });

      return {
        status: 'OK',
        message: 'REFRESH TOKEN SUCCESS',
        access_token: accessToken,
      };
    } catch (err) {
      return {
        status: 'err',
        message: 'Authentication failed',
      };
    }
  }
}
