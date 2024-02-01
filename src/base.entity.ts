import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, Column, DeleteDateColumn
} from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "modified_at" })
  modifiedAt: Date;
}
