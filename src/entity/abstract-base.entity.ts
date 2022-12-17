import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
export abstract class DateContent {
  @CreateDateColumn()
  @ApiProperty({ description: 'createdAt' })
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'updatedAt' })
  updatedAt?: Date;
}
