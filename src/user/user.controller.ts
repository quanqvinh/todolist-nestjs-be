import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard'
import { UpdateUserInfoDTO } from './dto/update-user-info.dto'
import { CreateUserDTO } from './dto/create-user.dto'
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { User } from './schema/user.schema'
import { UserService } from './user.service'
import { AuthenticatedUser } from 'src/auth/config/jwt.strategy'
import * as DUser from './decorator/user.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@DUser.User() user: AuthenticatedUser): Promise<User> {
    return await this.service.findById(user.id)
  }

  @Post()
  async createNewUser(@Body() createUserDTO: CreateUserDTO): Promise<boolean> {
    const createdUser = await this.service.create(createUserDTO)
    return Boolean(createdUser)
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUserInfo(
    @DUser.User() user: AuthenticatedUser,
    @Body() updateUserInfoDTO: UpdateUserInfoDTO,
  ): Promise<boolean> {
    const res = await this.service.updateInfo(user.id, updateUserInfoDTO)
    return res.matchedCount === 1
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@DUser.User() user: AuthenticatedUser): Promise<boolean> {
    const res = await this.service.delete(user.id)
    return res.deletedCount === 1
  }
}
