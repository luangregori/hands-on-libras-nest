import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  image_url: string;

  @Prop()
  email_verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
