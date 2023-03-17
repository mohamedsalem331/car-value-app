import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/users.entity'
import { plainToInstance } from 'class-transformer'
import { CreateUserDto } from './dtos'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(userCreateDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(userCreateDto)

    return this.usersRepository.save(user)
  }

  findUserById(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail({ where: { id } })
  }

  findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async updateUserById(id: number, attrs: Partial<User>) {
    const user = await this.findUserById(id)

    Object.assign(user, attrs)

    return this.usersRepository.save(user)

    // const newUser = plainToInstance(User, user)
  }

  async deleteUserById(id: number): Promise<number> {
    this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute()

    return id
  }
}
