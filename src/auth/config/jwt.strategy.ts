import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface AuthenticatedUser {
  id: string
  email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    console.log(configService.get<string>('JWT_SECRET'), process.env.JWT_SECRET)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ?? process.env.JWT_SECRET,
    })
  }

  validate(payload: any): AuthenticatedUser {
    return { id: payload.userId, email: payload.email }
  }
}
