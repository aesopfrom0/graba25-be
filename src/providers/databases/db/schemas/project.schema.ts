import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Task } from '@graba25-be/providers/databases/db/schemas/task.schema';
import { User } from '@graba25-be/providers/databases/db/schemas/user.schema';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ default: false })
  isFinished!: boolean;

  @Prop({ default: false })
  isArchived!: boolean;

  @Prop({ required: true, type: Date })
  dueDate!: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] })
  tasks!: Task[];

  @Prop({ default: new Date() })
  createdAt!: Date;

  @Prop({ default: new Date() })
  updatedAt!: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user!: User;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// ProjectSchema.virtual('id').get(function (this: Project) {
//   return this._id.toString();
// });
