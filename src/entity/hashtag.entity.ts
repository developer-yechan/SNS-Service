import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('hashtags')
export class Hashtag {
  @PrimaryColumn()
  id: number;

  @Column()
  hashtag: string;
}
