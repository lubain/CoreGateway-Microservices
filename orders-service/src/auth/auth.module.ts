import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './Auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_me_in_production',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
