import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ default: new Date() })
  createdAt!: Date;

  @Prop({ default: new Date() })
  updatedAt!: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.virtual('id').get(function () {
  return this._id.toString();
});
