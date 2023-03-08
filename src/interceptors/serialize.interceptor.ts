import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, map } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...')

    return next.handle().pipe(tap(() => console.log(`After... `)))
  }
}
