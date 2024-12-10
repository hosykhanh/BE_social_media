import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
      algorithm: this.configService.get<string>('JWT_ALGORITHM') as any,
    });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      algorithm: this.configService.get<string>('JWT_ALGORITHM') as any,
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

  async decodeToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async checkRole(token: string, role: 'admin' | 'user'): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });

      // Kiểm tra quyền
      if (role === 'admin' && decoded.isAdmin) {
        return true;
      } else if (role === 'user' && !decoded.isAdmin) {
        return true;
      }

      throw new UnauthorizedException('Insufficient permissions');
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
