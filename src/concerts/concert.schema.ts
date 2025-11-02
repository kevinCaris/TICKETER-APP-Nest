import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Concert extends Document {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, type: String })
  image: string;

  @Prop({ required: true, type: Boolean, default: true })
  status: boolean;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  totalSeats: number;

  @Prop({ required: true, type: Number })
  availableSeats: number;

  @Prop({ required: true, type: String })
  genre: string;

  @Prop({ required: true, type: String })
  location: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  hour: string;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Booking', default: [] })
  bookings: Types.ObjectId[];
}
export const ConcertSchema = SchemaFactory.createForClass(Concert);