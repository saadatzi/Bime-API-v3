import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class RefreshToken extends mongoose.Document {
  @Prop({ required: true })
  refreshToken: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  ip: string;

  @Prop()
  browser: string;

  @Prop()
  country: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
