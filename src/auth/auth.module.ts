import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { MailModule } from '../mail/mail.module';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { UsersModule } from 'src/users/users.module';
import { AuthAdminGuard } from './auth-admin.guard';
import { GroupsModule } from 'src/groups/groups.module';
import { ConcertsModule } from 'src/concerts/concerts.module';

@Module({
  imports: [
    GroupsModule,
    ConcertsModule,
    UsersModule,
    MailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'default-secret-change-this',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthGuard, AuthAdminGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, AuthAdminGuard],
})
export class AuthModule {}