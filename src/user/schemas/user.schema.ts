import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User extends mongoose.Document {
  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ trim: true })
  mobile: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ default: 'avatar.png' })
  avatar: string;

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ unique: true })
  email: string;

  // find the enum for Api for the next time
  @Prop({
    type: 'string',
    enum: ['admin', 'superAdmin', 'customer'],
    default: 'customer',
  })
  role: string;

  @Prop({ default: false })
  block: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  city: mongoose.Types.ObjectId;

  @Prop()
  password: string;

  @Prop()
  salt: string;

  @Prop({ type: Number, default: 0 })
  wallet: Number;

  @Prop({ type: 'string', enum: ['male', 'female'], default: 'male' })
  sex: string;

  validatePassword = async function (password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
