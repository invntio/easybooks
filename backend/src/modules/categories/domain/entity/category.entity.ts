import {
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  Entity,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Category, (category) => category.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  parent?: Category;

  @Column('uuid', { nullable: true })
  parentId?: string;

  @OneToMany(() => Category, (category) => category.parent, { nullable: true })
  subcategories?: Category[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
