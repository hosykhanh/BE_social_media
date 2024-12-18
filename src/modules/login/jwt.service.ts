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

  async refreshToken(authHeader: string): Promise<any> {
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
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

  async checkRole(
    authHeader: string,
    role: 'admin' | 'user',
    id?: string, // Tham số id tùy chọn
  ): Promise<boolean> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authHeader.split(' ')[1]; // Lấy token từ header
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    let decoded;
    try {
      // Giải mã token
      decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }

    // Nếu có tham số id, kiểm tra quyền dựa trên id
    if (id && decoded.id !== id && !decoded.isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action',
      );
    }

    // Kiểm tra quyền dựa trên role
    if (role === 'admin' && decoded.isAdmin) {
      return true;
    } else if (role === 'user') {
      return true;
    }

    throw new UnauthorizedException('Insufficient permissions');
  }
}
