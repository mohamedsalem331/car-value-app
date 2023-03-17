import { hashPassword } from '../../utils/crypt.util'
import {
  AfterRemove,
  AfterUpdate,
  BeforeUpdate,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'
import { Report } from 'src/reports/entities/reports.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: false })
  admin: boolean

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]

  @BeforeInsert()
  async preInsert() {
    this.password = await hashPassword(this.password)
    console.log('user added', this.id)
  }

  @BeforeUpdate()
  async preUpdate() {
    this.password = await hashPassword(this.password)
    console.log('before update', this.password)
  }

  @AfterUpdate()
  logUpdate() {
    console.log('after updated', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('removed ', this.id)
  }
}
