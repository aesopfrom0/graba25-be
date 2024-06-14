import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Harvest extends Document {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  date!: string; // Storing date as a string in YYMMDD format

  @Prop({ required: true })
  pomodoros!: number;

  @Prop({ required: true })
  tasksCompleted!: number;

  @Prop({ required: true })
  secondsInvested!: number;
}

export const HarvestSchema = SchemaFactory.createForClass(Harvest);
