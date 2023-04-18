import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ comment: '유저 id'})
  userId!: number;

  @Column({ length: 500, comment: 'task description', default: '' })
  title!: string;

  @Column({ default: 1, comment: '예상 시도 횟수' })
  estAttempts!: number;

  @Column({ default: 0, comment: '실제 시도 횟수' })
  actAttempts!: number;

  @Column({ length: 10000, comment: '세부 메모', nullable: true })
  memo?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
