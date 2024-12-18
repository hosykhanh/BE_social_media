import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { authenticator } from 'otplib';

@Injectable()
export class OTPAuthService {
  constructor() {}

  async generateQRCode(secret: string, email: string): Promise<string> {
    const otpauthUrl = authenticator.keyuri(email, 'HSK Social Media', secret);
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }
}
