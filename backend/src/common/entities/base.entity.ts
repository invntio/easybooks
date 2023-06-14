import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ nullable: false })
  public createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  public updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  public deletedAt: Date;

  // @BeforeInsert()
  // public beforeInsert() {
  //   const now: Date = new Date();
  //   this.createdAt = now;
  //   this.updatedAt = now;
  // }

  // @BeforeUpdate()
  // public BeforeUpdate() {
  //   const now: Date = new Date();
  //   this.updatedAt = now;
  // }
}
