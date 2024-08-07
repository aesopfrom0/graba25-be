import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Task } from '@graba25-be/providers/databases/db/schemas/task.schema';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';

@Schema({ timestamps: true })
export class Interval {
  constructor(start: Date, end?: Date) {
    this.start = start;
    this.end = end;
  }

  @Prop({ required: true, type: Date, default: new Date() })
  start!: Date;

  @Prop({ required: false, type: Date })
  end?: Date;
}

export const IntervalSchema = SchemaFactory.createForClass(Interval);

@Schema({ timestamps: true })
export class TimeLog extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user!: User;

  @Prop({ default: false })
  isFinished!: boolean;

  @Prop({ default: 1 })
  attemptN!: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  task!: Task;

  @Prop({ default: new Date() })
  createdAt!: Date;

  @Prop({ default: new Date() })
  updatedAt!: Date;

  @Prop({ type: [{ type: IntervalSchema, default: [] }] })
  intervals!: Interval[];
}

export const TimeLogSchema = SchemaFactory.createForClass(TimeLog);
