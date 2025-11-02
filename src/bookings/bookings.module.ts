import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from './booking.schema';
import { ConcertsModule } from '../concerts/concerts.module';
import { Concert, ConcertSchema } from 'src/concerts/concert.schema';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }, { name: Concert.name, schema: ConcertSchema }, { name: User.name, schema: UserSchema }]),
    ConcertsModule,
    UsersModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
