import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { MinioService } from '../modules/minio/minio.service';

@Injectable()
export class UserAvatarInterceptor implements NestInterceptor {
  constructor(private readonly minioService: MinioService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        const attachAvatarUrl = async (user: any) => {
          // Nếu có avatarKey, lấy URL từ MinIO, nếu không trả về avatarUrl là ""
          if (user?.avatarKey) {
            const avatarUrl = await this.minioService.getSignedUrl(
              user.avatarKey,
            );
            return {
              _id: user._id,
              career: user.career,
              name: user.name,
              email: user.email,
              gender: user.gender,
              dateOfBirth: user.dateOfBirth,
              phone: user.phone,
              address: user.address,
              isAdmin: user.isAdmin,
              avatar: avatarUrl, // Thêm avatarUrl vào dữ liệu
              friends: user.friends,
              friendRequests: user.friendRequests,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              __v: user.__v,
            };
          }
          // Nếu không có avatarKey, trả về avatarUrl rỗng
          return {
            _id: user._id,
            career: user.career,
            name: user.name,
            email: user.email,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
            avatar: user.avatar || '', // Nếu không có avatarKey thì avatarUrl là ""
            friends: user.friends,
            friendRequests: user.friendRequests,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            __v: user.__v,
          };
        };

        if (Array.isArray(data)) {
          return await Promise.all(data.map(attachAvatarUrl)); // Dành cho trường hợp trả về nhiều users
        }

        return await attachAvatarUrl(data); // Dành cho trường hợp trả về 1 user
      }),
      map((res) => res), // Flatten the Promise from `map`
    );
  }
}
