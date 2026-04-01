import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './Auth.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_me_in_production',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthResolver, AuthService, AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
