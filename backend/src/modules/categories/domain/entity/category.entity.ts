import { BaseEntity } from '@common/entities/base.entity';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
