import { User } from './../user/decorator/user.decorator'
import { JwtAuthGuard } from './guard/jwt-auth.guard'
import { GoogleAuthGuard } from './guard/google-auth.guard'
import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { AuthService, AuthToken } from './auth.service'
import { Request } from 'express'
import { AuthenticatedUser } from './config/jwt.strategy'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  googleAuthRedirect(@Req() req: Request): AuthToken {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  refreshAccessAuthToken(@User() user: AuthenticatedUser): AuthToken {
    return this.authService.login(user)
  }
}
