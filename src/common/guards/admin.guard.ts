import { CanActivate, ExecutionContext } from '@nestjs/common'

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const currentUser = request.user
    return currentUser.admin
  }
}
