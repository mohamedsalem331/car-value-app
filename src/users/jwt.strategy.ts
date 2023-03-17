import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      usernameField: 'email',
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    })
  }

  private static extractJWT(request: Request): string | null {
    let data = request?.cookies['auth-cookie']

    if (!data) {
      return null
    }
    return data
  }

  async validate(payload: { email: string }) {
    console.log('payload', payload)

    const user = await this.authService.validateUser(payload)

    if (!user) throw new UnauthorizedException()

    return user
  }
}
