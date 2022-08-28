import { Profile } from 'passport-google-oauth20'
import { CreateUserDTO } from '../user/dto/create-user.dto'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UserService } from 'src/user/user.service'
import { User } from 'src/user/schema/user.schema'
import { JwtService } from '@nestjs/jwt'

export interface GoogleResponse {
  message: string
  user?: Express.User
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  googleLogin(req: Request): GoogleResponse {
    if (!req.user) return { message: 'No user from google' }
    return {
      message: 'User information from google',
      user: req.user,
    }
  }

  async findOrCreateUser(profile: Profile): Promise<User> {
    let user = await this.userService.findByEmail(profile._json.email)
    if (!user) {
      const createUser: CreateUserDTO = {
        email: profile._json.email,
        name: profile._json.name,
        avatar: profile._json.picture,
      }
      user = await this.userService.create(createUser)
    }
    return user
  }

  login(user: any): AuthToken {
    const payload = { userId: user._id || user.id, email: user.email }
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '1d',
      }),
    }
  }
}
