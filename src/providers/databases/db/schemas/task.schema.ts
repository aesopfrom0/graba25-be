import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Project } from '@graba25-be/providers/databases/db/schemas/project.schema';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: false })
  memo!: string;

  @Prop({ type: Number, required: true, default: 0 })
  actAttempts!: number;

  @Prop({ type: Number, required: true, default: 1 })
  estAttempts!: number;

  @Prop({ type: Boolean, default: false })
  isFinished!: boolean;

  @Prop({ type: Boolean, default: false })
  isArchived!: boolean;

  @Prop({ type: Boolean, default: false })
  isCurrentTask!: boolean;

  @Prop({ type: Date, required: false })
  dueDate?: Date;

  // notion 연동한 경우
  @Prop({ type: String, required: false })
  notionPageId?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project?: Project;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] })
  tasks!: Task[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user!: User;

  createdAt: Date = new Date();
  updatedAt: Date = new Date(); // Add initializer for 'updatedAt' property
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.virtual('id').get(function () {
  return this._id.toString();
});

// TaskSchema.set('toObject', {
//   virtuals: true,
// });

// TaskSchema.set('toJSON', {
//   virtuals: true,
// });
