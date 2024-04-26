import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

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

  createdAt: Date = new Date();
  updatedAt: Date = new Date(); // Add initializer for 'updatedAt' property
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// _id 필드를 문자열로 변환하여 id라는 이름의 가상 속성을 생성
TaskSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// 가상 속성을 JSON 형식으로 출력할 수 있게 설정
TaskSchema.set('toJSON', {
  virtuals: true,
});
