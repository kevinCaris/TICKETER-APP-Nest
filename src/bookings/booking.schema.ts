import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Concert } from 'src/concerts/concert.schema';
import { User } from 'src/users/entities/user.entity';

export type BookingDocument = HydratedDocument<Booking>;

export type PopulatedBooking = Omit<Booking, 'concertId' | 'userId'> & {
  concertId: Concert;
  userId: User;
};

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: Concert.name, required: true })
  concertId: Types.ObjectId | Concert;

  @Prop({ type: Number, required: true})
  quantity: number

  @Prop({ type: Number, required: true})
  amount: number
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
