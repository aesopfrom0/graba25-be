import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  displayName!: string;

  @Prop()
  photoUrl!: string;

  @Prop()
  googleId?: string;

  @Prop({ default: new Date() })
  createdAt!: Date;

  @Prop({ default: new Date() })
  updatedAt!: Date;

  @Prop({ required: true })
  timeZone!: string; // e.g. 'Europe/Istanbul'
}

export const UserSchema = SchemaFactory.createForClass(User);
