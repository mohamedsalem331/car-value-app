import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

// @Injectable()
// export class CryptService {
//   static async hashPassword(password: string): Promise<string> {
//     const saltRounds = 10

//     const newHashedPassword = await bcrypt.hash(password, saltRounds)

//     return newHashedPassword
//   }

//   static async validatePassword(
//     inputPassword: string,
//     hashedPassword: string,
//   ): Promise<Boolean> {
//     const validPassword = await bcrypt.compare(inputPassword, hashedPassword)

//     return validPassword
//   }
// }

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10

  const newHashedPassword = await bcrypt.hash(password, saltRounds)

  return newHashedPassword
}

export async function validatePassword(
  inputPassword: string,
  hashedPassword: string,
): Promise<Boolean> {
  const validPassword = await bcrypt.compare(inputPassword, hashedPassword)

  return validPassword
}
