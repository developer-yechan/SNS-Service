import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
export abstract class DateContent {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
