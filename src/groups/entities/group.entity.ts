import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop()
  genre: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  image: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Concert' }] })
  concerts: Types.ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
