import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToInstance } from 'class-transformer'
import { UserDto } from 'src/auth/dtos/user.dto'

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private CustomDto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...')

    return next.handle().pipe(
      map((data) =>
        plainToInstance(this.CustomDto, data, {
          excludeExtraneousValues: true,
        }),
      ),
    )
  }
}
