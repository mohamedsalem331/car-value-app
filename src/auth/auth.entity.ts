import {
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @AfterUpdate()
  logUpdate() {
    console.log('updated ', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('removed ', this.id)
  }
}
