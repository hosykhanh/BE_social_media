import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { OTPAuthService } from './otp.service';
import { JwtAuthService } from './jwt.service';
import { authenticator } from 'otplib';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UserService,
    private readonly otpAuthService: OTPAuthService,
  ) {}

  async login(loginDto: { email: string; password: string }) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      return { status: 'err', message: 'The user does not exist' };
    }

    if (loginDto.password !== user.password) {
      return { status: 'err', message: 'Email or password is incorrect' };
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      return { status: 'err', message: 'Email or password is incorrect' };
    }

    // Tạo access_token và refresh_token
    const access_token = await this.jwtAuthService.generateAccessToken({
      id: user._id,
      isAdmin: user.isAdmin,
    });

    const refresh_token = await this.jwtAuthService.generateRefreshToken({
      id: user._id,
      isAdmin: user.isAdmin,
    });

    // Kiểm tra và tạo secret nếu chưa tồn tại
    let qrCode = null;
    if (!user.otpSecret) {
      const secret = authenticator.generateSecret(); // Tạo secret mới

      // Tạo mã QR từ secret
      qrCode = await this.otpAuthService.generateQRCode(secret, user.email);

      // Lưu secret vào cơ sở dữ liệu
      await this.userService.updateUser(user._id.toString(), {
        otpSecret: secret,
      });
    }

    return {
      status: 'OK',
      message: 'Login successful',
      access_token,
      refresh_token,
      qrCode, // Trả về mã QR nếu là lần đầu đăng nhập
    };
  }

  async verifyOTP(userId: string, otp: string): Promise<boolean> {
    // Lấy thông tin user từ database
    const user = await this.userService.otpFindById(userId);

    if (!user || !user.otpSecret) {
      throw new Error('User or OTP secret not found');
    }

    // Xác minh OTP dựa trên secret của user
    const isValid = authenticator.verify({
      token: otp,
      secret: user.otpSecret,
    });

    return isValid;
  }

  async resendQRCode(userId: string) {
    const user = await this.userService.otpFindById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    if (!user.otpSecret) {
      throw new Error(
        'User does not have an OTP secret. Please log in to generate one.',
      );
    }

    const qrCode = await this.otpAuthService.generateQRCode(
      user.otpSecret,
      user.email,
    );
    return { status: 'OK', message: 'Resend QRCode successful', qrCode };
  }
}
