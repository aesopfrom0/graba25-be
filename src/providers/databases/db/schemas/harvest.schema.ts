import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Harvest extends Document {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true, unique: true, description: 'Date in YYYYMMDD format', example: 20240601 })
  date!: number; // YYYYMMDD format

  @Prop({ required: true, description: 'Number of pomodoros completed', example: 5 })
  pomodoros!: number;

  @Prop({ required: true, description: 'Number of tasks completed', example: 3 })
  tasksCompleted!: number;

  @Prop({ required: true, description: 'Total seconds invested', example: 3600 })
  secondsInvested!: number;
}

export const HarvestSchema = SchemaFactory.createForClass(Harvest);
