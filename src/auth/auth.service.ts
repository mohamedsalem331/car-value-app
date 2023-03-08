import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './auth.entity'
import { CreateUserDto } from './dtos/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  signUp(email: string, password: string): Promise<User> {
    const user = this.usersRepository.create({ email, password })

    return this.usersRepository.save(user)
  }

  findUserByEmail(email: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { email },
    })
  }

  findUserById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } })
  }

  updateUserById(id: number, attrs: Partial<User>) {
    // NotFoundException

    return this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(attrs)
      .where('id = :id', { id })
      .execute()
  }

  deleteUserById(id: number) {
    // NotFoundException

    return this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute()
  }
}
